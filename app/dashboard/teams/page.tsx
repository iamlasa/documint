import { Suspense } from 'react'
import { TeamsList } from '@/components/teams/teams-list'
import { TeamsSkeleton } from '@/components/teams/teams-skeleton'
import { CreateTeamButton } from '@/components/teams/create-team-button'

export default function TeamsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">
            Manage your teams and their access to spaces
          </p>
        </div>
        <CreateTeamButton />
      </div>
      <Suspense fallback={<TeamsSkeleton />}>
        <TeamsList />
      </Suspense>
    </div>
  )
}