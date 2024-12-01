import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getContentfulClient, getSpace } from '@/lib/contentful'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const spaces = await prisma.space.findMany({
      where: {
        user: {
          email: session.user.email
        }
      }
    })

    return NextResponse.json(spaces)
  } catch (error) {
    console.error('Error fetching spaces:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { spaceId, accessToken } = await req.json()
    if (!spaceId || !accessToken) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Verify Contentful credentials
    const client = getContentfulClient(accessToken)
    const space = await getSpace(client, spaceId)

    // Create space in database
    const newSpace = await prisma.space.create({
      data: {
        spaceId,
        name: space.name,
        accessToken,
        user: {
          connect: {
            email: session.user.email,
          },
        },
      },
    })

    return NextResponse.json(newSpace)
  } catch (error) {
    console.error('Error creating space:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}