'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
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
        <div>
          <Card className="group h-full relative overflow-hidden border border-dashed bg-white p-6 transition-all hover:border-primary/20 hover:shadow-lg cursor-pointer">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1F5F9]">
                  <Plus className="h-6 w-6 text-[#0F1729]" />
                </div>
                <h3 className="font-medium text-[#0F1729]">Add Space</h3>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Connect a Contentful space
                </p>
              </div>
            </div>
          </Card>
        </div>
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
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Adding Space...
              </>
            ) : (
              'Add Space'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}