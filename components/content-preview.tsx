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
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(entry.content)
  const [isSaving, setIsSaving] = useState(false)
  const [viewMode, setViewMode] = useState<'single' | 'split'>('single')

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
  <div className="fixed inset-0 bg-gray-100/70 backdrop-blur-sm" />
  <DialogContent className="max-w-4xl h-[30vh] bg-white rounded-2xl border shadow-sm" aria-describedby="dialog-description">
  <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="pb-3">
        <div className="flex items-center justify-between">
          <div>
          <DialogTitle className="flex items-center gap-2 text-2xl font-medium">
              {entry.title}
              <Badge variant={entry.status === 'published' ? 'default' : 'secondary'} className="font-normal">
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
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 mt-2">
      <div className="h-full rounded-xl bg-[#F8FAFC] p-4">
          <ScrollArea className="h-full">
            {isEditing ? (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[300px] font-mono"
              />
            ) : (
              renderContent(entry.content)
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  </DialogContent>
</Dialog>
  )
}