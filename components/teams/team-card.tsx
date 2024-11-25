'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { InviteMemberDialog } from './invite-member-dialog'
import { ManageRolesDialog } from './manage-roles-dialog'
import { Users, Settings } from 'lucide-react'

interface TeamCardProps {
  team: {
    id: string
    name: string
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
}

export function TeamCard({ team }: TeamCardProps) {
  const [showInvite, setShowInvite] = useState(false)
  const [showManageRoles, setShowManageRoles] = useState(false)

  const isAdmin = team.members.some(
    (member) => member.role === 'ADMIN'
  )

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">{team.name}</CardTitle>
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowManageRoles(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex -space-x-2">
              {team.members.slice(0, 4).map((member) => (
                <Avatar key={member.id} className="border-2 border-background">
                  <AvatarImage src={member.user.image} alt={member.user.name} />
                  <AvatarFallback>
                    {member.user.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              ))}
              {team.members.length > 4 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                  +{team.members.length - 4}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="space-x-2">
                {team.members.slice(0, 2).map((member) => (
                  <Badge key={member.id} variant="secondary">
                    {member.role.toLowerCase()}
                  </Badge>
                ))}
                {team.members.length > 2 && (
                  <Badge variant="secondary">
                    +{team.members.length - 2} more
                  </Badge>
                )}
              </div>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInvite(true)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Invite
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showInvite && (
        <InviteMemberDialog
          teamId={team.id}
          onClose={() => setShowInvite(false)}
        />
      )}

      {showManageRoles && (
        <ManageRolesDialog
          teamId={team.id}
          members={team.members}
          onClose={() => setShowManageRoles(false)}
        />
      )}
    </>
  )
}