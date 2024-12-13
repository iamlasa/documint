'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { type Space } from '@/types'
import { Box, Clock } from 'lucide-react'

interface SpaceCardProps {
  space: Space
}

export function SpaceCard({ space }: SpaceCardProps) {
  return (
    <Link href={`/dashboard/spaces/${space.id}`}>
      <Card className="group relative overflow-hidden border bg-white p-6 transition-all hover:border-primary/20 shadow-none !shadow-none">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            {/* Icon + Title Section */}
            <div className="flex items-center gap-4">
              <div>
                <h3 className="font-medium text-[#0F1729]">
                  {space.name}
                </h3>
                <p className="text-sm text-[#6B7280]">
                  Space ID: {space.spaceId}
                </p>
              </div>
            </div>

            {/* Last Accessed Section */}
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <Clock className="h-4 w-4" />
              <span>Last accessed: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-4 flex gap-3">
          <div className="flex items-center gap-2 rounded-full bg-[#F1F5F9] px-3 py-1 text-sm">
            <span className="text-[#6B7280]">12</span>
            <span className="text-[#0F1729]">Content Types</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#F1F5F9] px-3 py-1 text-sm">
            <span className="text-[#6B7280]">156</span>
            <span className="text-[#0F1729]">Entries</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}