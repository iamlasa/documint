'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { AddSpaceButton } from './add-space-button'
import { SpaceCard } from './space-card'
import { getSpaces } from '@/lib/local-storage'
import type { Space } from '@/types'

export function SpacesList() {
  const { data: session } = useSession()
  const [spaces, setSpaces] = useState<Space[]>([])

  useEffect(() => {
    if (session?.user?.id) {
      // Only get spaces for the current user's key
      const userSpacesKey = `documint_spaces_${session.user.id}`
      const storedSpaces = getSpaces(session.user.id)
      console.log("Current user ID:", session.user.id)
      console.log("Stored spaces:", storedSpaces)
      setSpaces(storedSpaces)
    }
  }, [session?.user?.id])

  return (
    <div className="grid gap-8 md:grid-cols-2">
    {spaces.map((space) => (
      <SpaceCard key={space.id} space={space} />
    ))}
    <AddSpaceButton 
      onSpaceAdded={(newSpace: Space) => setSpaces([...spaces, newSpace])} 
    />
  </div>
  )
}