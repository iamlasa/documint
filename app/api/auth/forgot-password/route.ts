import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    
    console.log('Processing reset for email:', email) // Debug log

    const user = await prisma.user.findUnique({
      where: { email },
    })

    console.log('User found:', !!user) // Debug log

    if (!user) {
      // Send success response even if user doesn't exist (security best practice)
      return NextResponse.json({ success: true })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    console.log('Updating user with reset token') // Debug log

    // Store reset token in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    console.log(`Reset link: http://localhost:3000/auth/reset-password?token=${resetToken}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Detailed password reset error:', error) // More detailed error logging
    return NextResponse.json(
      { error: 'Failed to process password reset. Please try again.' },
      { status: 500 }
    )
  }
}