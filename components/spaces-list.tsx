'use client'

import { useEffect, useState } from 'react'
import { AddSpaceButton } from './add-space-button'
import { SpaceCard } from './space-card'
import { type Space, getSpaces } from '@/lib/local-storage'

export function SpacesList() {
  const [spaces, setSpaces] = useState<Space[]>([])

  useEffect(() => {
    setSpaces(getSpaces())
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {spaces.map((space) => (
        <SpaceCard key={space.id} space={space} />
      ))}
      <AddSpaceButton onSpaceAdded={() => setSpaces(getSpaces())} />
    </div>
  )
}