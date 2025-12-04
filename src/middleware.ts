import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secretKey = process.env.AUTH_SECRET!
const encodedKey = new TextEncoder().encode(secretKey)

async function verifyToken(token: string) {
    try {
        await jwtVerify(token, encodedKey, { algorithms: ['HS256'] })
        return true
    } catch {
        return false
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const sessionCookie = request.cookies.get('session')?.value

    const isOnAdmin = pathname.startsWith('/admin')
    const isOnLogin = pathname === '/admin/login'

    // Check if session is valid
    const isLoggedIn = sessionCookie ? await verifyToken(sessionCookie) : false

    // Redirect to login if accessing admin without auth
    if (isOnAdmin && !isOnLogin && !isLoggedIn) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Redirect to admin if already logged in and on login page
    if (isOnLogin && isLoggedIn) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
