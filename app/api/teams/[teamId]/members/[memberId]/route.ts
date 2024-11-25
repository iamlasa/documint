import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  req: Request,
  { params }: { params: { teamId: string; memberId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check if the updater is an admin
    const isAdmin = await prisma.teamMember.findFirst({
      where: {
        teamId: params.teamId,
        user: { email: session.user.email },
        role: 'ADMIN'
      }
    })

    if (!isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { role } = await req.json()
    if (!role) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const member = await prisma.teamMember.update({
      where: { id: params.memberId },
      data: { role }
    })

    return NextResponse.json(member)
  } catch (error) {
    console.error('Error updating team member:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { teamId: string; memberId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check if the remover is an admin
    const isAdmin = await prisma.teamMember.findFirst({
      where: {
        teamId: params.teamId,
        user: { email: session.user.email },
        role: 'ADMIN'
      }
    })

    if (!isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await prisma.teamMember.delete({
      where: { id: params.memberId }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error removing team member:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}