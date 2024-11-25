'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { getSpaces } from '@/lib/local-storage'
import { Search } from '@/components/search'
import { AddSpaceButton } from './add-space-button'
import { Box } from 'lucide-react'

export function SpaceSelector() {
  const [mounted, setMounted] = useState(false)
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>('')
  const [spaces, setSpaces] = useState([])

  useEffect(() => {
    setMounted(true)
    setSpaces(getSpaces())
  }, [])

  if (!mounted) return null

  return (
    <div className="space-y-8">
      {spaces.length > 0 ? (
        <>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select 
              value={selectedSpaceId} 
              onValueChange={setSelectedSpaceId}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select a space to search" />
              </SelectTrigger>
              <SelectContent>
                {spaces.map((space) => (
                  <SelectItem key={space.id} value={space.id}>
                    {space.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <AddSpaceButton onSpaceAdded={() => setSpaces(getSpaces())} />
          </div>

          {selectedSpaceId && (
            <Card className="p-6 shadow-lg">
              <Search spaceId={selectedSpaceId} />
            </Card>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <Box className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">
            Welcome to Documint
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Get started by adding your first Contentful space to begin managing your content efficiently.
          </p>
          <AddSpaceButton onSpaceAdded={() => setSpaces(getSpaces())} />
        </div>
      )}
    </div>
  )
}