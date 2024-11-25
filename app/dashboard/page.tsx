import { Suspense } from 'react'
import { SpacesList } from '@/components/spaces-list'
import { SpacesSkeleton } from '@/components/spaces-skeleton'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Spaces</h1>
        <p className="text-muted-foreground">
          Manage your Contentful spaces and content
        </p>
      </div>
      <Suspense fallback={<SpacesSkeleton />}>
        <SpacesList />
      </Suspense>
    </div>
  )
}