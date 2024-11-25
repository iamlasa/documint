export type Role = 'ADMIN' | 'EDITOR' | 'VIEWER'

export const permissions = {
  ADMIN: {
    canInviteMembers: true,
    canRemoveMembers: true,
    canUpdateRoles: true,
    canDeleteTeam: true,
    canCreateContent: true,
    canEditContent: true,
    canDeleteContent: true,
    canPublishContent: true,
  },
  EDITOR: {
    canInviteMembers: false,
    canRemoveMembers: false,
    canUpdateRoles: false,
    canDeleteTeam: false,
    canCreateContent: true,
    canEditContent: true,
    canDeleteContent: false,
    canPublishContent: true,
  },
  VIEWER: {
    canInviteMembers: false,
    canRemoveMembers: false,
    canUpdateRoles: false,
    canDeleteTeam: false,
    canCreateContent: false,
    canEditContent: false,
    canDeleteContent: false,
    canPublishContent: false,
  },
} as const

export function hasPermission(role: Role, permission: keyof typeof permissions[Role]) {
  return permissions[role][permission]
}

export async function checkTeamPermission(
  userId: string,
  teamId: string,
  permission: keyof typeof permissions[Role]
): Promise<boolean> {
  const member = await prisma.teamMember.findFirst({
    where: {
      userId,
      teamId,
    },
  })

  if (!member) return false

  return hasPermission(member.role, permission)
}