'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { type Space } from '@/lib/local-storage'
import { ArrowRight, Box, Clock, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface SpaceCardProps {
  space: Space
}

export function SpaceCard({ space }: SpaceCardProps) {
  return (
    <Link href={`/spaces/${space.id}`}>
      <Card className="card-modern group">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 p-3 transition-transform duration-300 group-hover:scale-110">
                  <Box className="h-6 w-6 text-primary animate-float" />
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    <Users className="h-3 w-3" />
                  </Badge>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight gradient-text">
                  {space.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Space ID: {space.spaceId}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last accessed: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <ArrowRight className="h-5 w-5 transform text-primary transition-all duration-300 group-hover:translate-x-1 opacity-0 group-hover:opacity-100" />
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <Badge variant="outline" className="rounded-lg">
            12 Content Types
          </Badge>
          <Badge variant="outline" className="rounded-lg">
            156 Entries
          </Badge>
        </div>
      </Card>
    </Link>
  )
}