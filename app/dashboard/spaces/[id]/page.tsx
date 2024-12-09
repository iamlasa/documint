'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { getSpaces } from '@/lib/local-storage'
import { Search } from '@/components/search'
import { useSession } from 'next-auth/react'
import type { Space } from '@/types'

export default function SpacePage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [space, setSpace] = useState<Space | null>(null)

  useEffect(() => {
    if (session?.user?.id) {
      const spaces = getSpaces(session.user.id)
      const currentSpace = spaces.find((s) => s.id === params.id)
      
      console.log('Spaces:', spaces)
      console.log('Current Space ID:', params.id)
      
      if (!currentSpace) {
        notFound()
        return
      }

      setSpace(currentSpace)
    }
  }, [params.id, session?.user?.id])

  if (!space) {
    return null
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{space.name}</h1>
          <p className="text-muted-foreground">
            Search and manage content in this space
          </p>
        </div>
        <Search spaceId={space.id} />
      </div>
    </div>
  )
}