import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')

  if (!token) {
    // Allow access to auth pages when not logged in
    if (isAuthPage) {
      return NextResponse.next()
    }
    // Redirect to signin for other pages
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Redirect to dashboard if trying to access auth pages while logged in
  if (isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}