'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { diffChars } from 'diff'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { getContentfulClient, getSpace, getEnvironment } from '@/lib/contentful'
import { getSpaces } from '@/lib/local-storage'
import { useToast } from '@/hooks/use-toast'
import { ScrollArea } from '@/components/ui/scroll-area'
import { StoredSpace } from '@/lib/local-storage'
import { useSession } from 'next-auth/react'
import { 
  Eye, 
  Code, 
  History, 
  Split, 
  Save,
  ExternalLink,
  Loader2,
  X
} from 'lucide-react'

interface Version {
  sys: {
    id: string
    createdAt: string
  }
  fields: any
}

interface ContentPreviewProps {
  entry: {
    id: string
    title: string
    content: string
    contentType: string
    lastUpdated: string
    status: string
    spaceId: string
  }
  onClose: () => void
}

export function ContentPreview({ entry, onClose }: ContentPreviewProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(entry.content)
  const [versions, setVersions] = useState<Version[]>([])
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [viewMode, setViewMode] = useState<'single' | 'split'>('single')
  const [isLoadingVersions, setIsLoadingVersions] = useState(false)

  useEffect(() => {
    loadVersions()
  }, [])

  async function loadVersions() {
    setIsLoadingVersions(true)
    try {
      const { data: session } = useSession()
      if (!session?.user?.id) return

      const spaces = getSpaces(session.user.id) as StoredSpace[]
      const space = spaces.find(s => s.id === entry.spaceId)
      if (!space) {
        console.error("Space not found:", entry.spaceId)
        return
      }

      const client = getContentfulClient(space.accessToken)
      const spaceClient = await getSpace(client, space.spaceId)
      const environment = await getEnvironment(spaceClient)
      const contentfulEntry = await environment.getEntry(entry.id)
      
      const versionsResponse = await contentfulEntry.getVersions()
      setVersions(versionsResponse.items)
    } catch (error) {
      console.error('Error loading versions:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load version history'
      })
    } finally {
      setIsLoadingVersions(false)
    }
  }

  async function handleSave() {
    setIsSaving(true)
    try {
      const { data: session } = useSession()
      if (!session?.user?.id) {
        throw new Error('User not authenticated')
      }

      const spaces = getSpaces(session.user.id) as StoredSpace[]
      const space = spaces.find(s => s.id === entry.spaceId)
      if (!space) {
        throw new Error('Space not found')
      }

      const client = getContentfulClient(space.accessToken)
      const spaceClient = await getSpace(client, space.spaceId)
      const environment = await getEnvironment(spaceClient)
      const contentfulEntry = await environment.getEntry(entry.id)

      const fieldKeys = Object.keys(contentfulEntry.fields)
      const contentField = fieldKeys.find(key => 
        contentfulEntry.fields[key]['en-US'] === entry.content
      )

      if (!contentField) throw new Error('Content field not found')

      contentfulEntry.fields[contentField]['en-US'] = editedContent
      
      await contentfulEntry.update()
      await contentfulEntry.publish()

      toast({
        title: 'Success',
        description: 'Content updated successfully'
      })

      setIsEditing(false)
      await loadVersions()
    } catch (error) {
      console.error('Save error:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save changes'
      })
    } finally {
      setIsSaving(false)
    }
  }

  function renderDiff(oldText: string, newText: string) {
    const diff = diffChars(oldText, newText)
    
    return (
      <pre className="whitespace-pre-wrap font-mono text-sm">
        {diff.map((part, i) => (
          <span
            key={i}
            className={
              part.added ? 'bg-green-500/20' :
              part.removed ? 'bg-red-500/20' :
              ''
            }
          >
            {part.value}
          </span>
        ))}
      </pre>
    )
  }

  function renderContent(content: string) {
    if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(content)
        return (
          <pre className="bg-muted rounded-lg p-4 overflow-auto">
            {JSON.stringify(parsed, null, 2)}
          </pre>
        )
      } catch {
        // If JSON parsing fails, treat as markdown
      }
    }

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        className="prose prose-sm dark:prose-invert max-w-none"
        components={{
          img: ({ node, ...props }) => (
            <div className="relative w-full">
              <img
                {...props}
                className="rounded-lg max-h-[500px] object-contain"
                alt={props.alt || 'Content image'}
              />
            </div>
          ),
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer">
              {props.children}
              <ExternalLink className="inline-block ml-1 h-3 w-3" />
            </a>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <DialogTitle className="flex items-center gap-2 text-xl">
              {entry.title}
              <Badge variant={entry.status === 'published' ? 'default' : 'secondary'}>
                {entry.status}
              </Badge>
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {new Date(entry.lastUpdated).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(mode => mode === 'single' ? 'split' : 'single')}
              className="h-8 w-8"
            >
              <Split className="h-4 w-4" />
            </Button>
            {isEditing ? (
              <Button
                onClick={handleSave}
                disabled={isSaving}
                size="sm"
                className="h-8"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                size="sm"
                className="h-8"
              >
                Edit
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="preview" className="flex-1 h-[calc(100%-4rem)]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="h-[calc(100%-2rem)] mt-4">
            <div className="h-full">
              {viewMode === 'split' ? (
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <ScrollArea className="h-full">
                      {isEditing ? (
                        <Textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="min-h-[500px] font-mono"
                        />
                      ) : (
                        <pre className="whitespace-pre-wrap">
                          {entry.content}
                        </pre>
                      )}
                    </ScrollArea>
                  </div>
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <ScrollArea className="h-full">
                      {renderContent(isEditing ? editedContent : entry.content)}
                    </ScrollArea>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border bg-muted/50 p-4 h-full">
                  <ScrollArea className="h-full">
                    {isEditing ? (
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="min-h-[500px] font-mono"
                      />
                    ) : (
                      renderContent(entry.content)
                    )}
                  </ScrollArea>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="h-[calc(100%-2rem)] mt-4">
            {isLoadingVersions ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading version history...
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="space-y-2">
                  <h3 className="font-medium">Versions</h3>
                  <ScrollArea className="h-[calc(100%-2rem)] border rounded-lg">
                    <div className="p-4 space-y-2">
                      {versions.map((version) => (
                        <Button
                          key={version.sys.id}
                          variant={selectedVersion === version.sys.id ? 'default' : 'outline'}
                          className="w-full justify-start"
                          onClick={() => setSelectedVersion(version.sys.id)}
                        >
                          <div className="truncate">
                            <div className="font-medium">
                              Version {version.sys.id}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(version.sys.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Changes</h3>
                  <ScrollArea className="h-[calc(100%-2rem)] border rounded-lg p-4">
                    {selectedVersion ? (
                      renderDiff(
                        versions.find(v => v.sys.id === selectedVersion)?.fields?.content?.['en-US'] || '',
                        entry.content
                      )
                    ) : (
                      <div className="text-muted-foreground">
                        Select a version to compare
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}