'use client'

import { useEffect, useState } from 'react'
import { TeamCard } from './team-card'

interface Team {
  id: string
  name: string
  spaceId: string
  members: {
    id: string
    role: 'ADMIN' | 'EDITOR' | 'VIEWER'
    user: {
      name: string
      email: string
      image: string
    }
  }[]
}

export function TeamsList() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTeams() {
      try {
        const response = await fetch('/api/teams')
        if (!response.ok) throw new Error('Failed to load teams')
        const data = await response.json()
        setTeams(data)
      } catch (error) {
        console.error('Error loading teams:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTeams()
  }, [])

  if (isLoading) return null

  if (teams.length === 0) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">No teams found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  )
}