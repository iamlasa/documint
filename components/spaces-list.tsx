'use client'

import { useEffect, useState } from 'react'
import { AddSpaceButton } from './add-space-button'
import { SpaceCard } from './space-card'
import { Space } from '@prisma/client'  // Update this import

export function SpacesList() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSpaces() {
      try {
        const response = await fetch('/api/spaces')
        if (!response.ok) throw new Error('Failed to fetch spaces')
        const data = await response.json()
        setSpaces(data)
      } catch (error) {
        console.error('Error fetching spaces:', error)
        // You could add error handling UI here
      } finally {
        setIsLoading(false)
      }
    }

    fetchSpaces()
  }, [])

  if (isLoading) {
    return <div>Loading spaces...</div>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {spaces.map((space) => (
        <SpaceCard key={space.id} space={space} />
      ))}
      <AddSpaceButton 
        onSpaceAdded={(newSpace) => setSpaces([...spaces, newSpace])} 
      />
    </div>
  )
}