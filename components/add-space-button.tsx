'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
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
import { addSpace, getSpaces } from '@/lib/local-storage'
import { getContentfulClient, getSpace } from '@/lib/contentful'
import { useToast } from "@/hooks/use-toast"
import type { Space } from '@/types'

interface AddSpaceButtonProps {
  onSpaceAdded: (space: Space) => void;
}

export function AddSpaceButton({ onSpaceAdded }: AddSpaceButtonProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!session?.user?.id) {
        throw new Error('You must be logged in to add spaces')
      }

      const formData = new FormData(e.currentTarget)
      const spaceId = formData.get('spaceId') as string
      const accessToken = formData.get('accessToken') as string

      // Check for duplicates using user ID
      const existingSpaces = getSpaces(session.user.id)
      console.log('Checking for duplicate space:', spaceId)
      
      const isDuplicate = existingSpaces.some(space => space.spaceId === spaceId)
      console.log('Is duplicate?', isDuplicate)

      if (isDuplicate) {
        console.log('Found duplicate, showing toast...')
        setIsLoading(false)
        setOpen(false)
        toast({
          variant: "destructive",
          title: "Error",
          description: "This space has already been added!"
        })
        return
      }

      const client = getContentfulClient(accessToken)
      const contentfulSpace = await getSpace(client, spaceId)
      
      const newSpace = addSpace({
        name: contentfulSpace.name,
        spaceId,
        accessToken,
      }, session.user.id)  // Pass the user ID here
      
      onSpaceAdded(newSpace)
      setOpen(false)
      toast({
        title: "Success",
        description: "Space added successfully!"
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add space"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-[140px] w-full">
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
            {isLoading && <span className="mr-2 animate-spin">⏳</span>}
            {isLoading ? 'Adding Space...' : 'Add Space'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}