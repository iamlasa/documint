import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { email, role } = await req.json()
    if (!email || !role) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Check if the inviter is an admin
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

    // Find or create the user
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email }
    })

    // Add the user to the team
    const member = await prisma.teamMember.create({
      data: {
        role,
        team: { connect: { id: params.teamId } },
        user: { connect: { id: user.id } }
      }
    })

    return NextResponse.json(member)
  } catch (error) {
    console.error('Error inviting team member:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}