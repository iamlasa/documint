'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { getContentfulClient, getSpace, getEnvironment } from '@/lib/contentful'
import { getSpaces } from '@/lib/local-storage'

interface BulkEditDialogProps {
  entries: any[]
  onClose: () => void
  spaceId: string
}

export function BulkEditDialog({ entries, onClose, spaceId }: BulkEditDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [replaceValue, setReplaceValue] = useState('')

  async function handleBulkEdit() {
    if (!searchValue || !replaceValue) return

    setIsLoading(true)
    const spaces = getSpaces()
    const space = spaces.find(s => s.id === spaceId)

    if (!space) {
      toast({
        variant: 'destructive',
        description: 'Space not found',
      })
      setIsLoading(false)
      return
    }

    try {
      const client = getContentfulClient(space.accessToken)
      const spaceClient = await getSpace(client, space.spaceId)
      const environment = await getEnvironment(spaceClient)

      // Process entries in batches of 5 to avoid rate limits
      const batchSize = 5
      const batches = Math.ceil(entries.length / batchSize)

      for (let i = 0; i < batches; i++) {
        const batch = entries.slice(i * batchSize, (i + 1) * batchSize)
        await Promise.all(
          batch.map(async (entry) => {
            const contentfulEntry = await environment.getEntry(entry.id)
            let modified = false

            // Update all text fields that contain the search value
            Object.keys(contentfulEntry.fields).forEach(fieldKey => {
              const field = contentfulEntry.fields[fieldKey]
              Object.keys(field).forEach(locale => {
                if (typeof field[locale] === 'string' && 
                    field[locale].includes(searchValue)) {
                  field[locale] = field[locale].replaceAll(
                    searchValue,
                    replaceValue
                  )
                  modified = true
                }
              })
            })

            if (modified) {
              await contentfulEntry.update()
              await contentfulEntry.publish()
            }
          })
        )
      }

      toast({
        title: 'Success',
        description: 'Bulk edit completed successfully',
      })
      onClose()
    } catch (error) {
      console.error('Bulk edit error:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update entries',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Bulk Edit ({entries.length} selected)
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Edit Entries</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Search for</Label>
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Text to find..."
            />
          </div>
          <div className="space-y-2">
            <Label>Replace with</Label>
            <Input
              value={replaceValue}
              onChange={(e) => setReplaceValue(e.target.value)}
              placeholder="Text to replace..."
            />
          </div>
          <Button
            onClick={handleBulkEdit}
            disabled={isLoading || !searchValue || !replaceValue}
            className="w-full"
          >
            {isLoading ? 'Updating...' : 'Update Entries'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}