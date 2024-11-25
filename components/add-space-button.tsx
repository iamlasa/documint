'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { addSpace } from '@/lib/local-storage'
import { getContentfulClient, getSpace } from '@/lib/contentful'
import { useToast } from '@/hooks/use-toast'

interface AddSpaceButtonProps {
  onSpaceAdded: () => void
}

export function AddSpaceButton({ onSpaceAdded }: AddSpaceButtonProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const spaceId = formData.get('spaceId') as string
    const accessToken = formData.get('accessToken') as string

    try {
      // Verify Contentful credentials
      const client = getContentfulClient(accessToken)
      const space = await getSpace(client, spaceId)

      // Add to local storage
      addSpace({
        name: space.name,
        spaceId,
        accessToken,
      })

      toast({
        title: 'Success',
        description: 'Space added successfully',
      })
      
      onSpaceAdded()
      setOpen(false)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add space. Please check your credentials.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-[240px] w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Space
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Contentful Space</DialogTitle>
          <DialogDescription>
            Add your Contentful space details to start managing content.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="spaceId">Space ID</Label>
            <Input
              id="spaceId"
              name="spaceId"
              placeholder="Enter your Contentful Space ID"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accessToken">Access Token</Label>
            <Input
              id="accessToken"
              name="accessToken"
              type="password"
              placeholder="Enter your Contentful Management Token"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Space'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}