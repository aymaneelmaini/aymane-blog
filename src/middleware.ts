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

    const isLoggedIn = sessionCookie ? await verifyToken(sessionCookie) : false

    if (isOnAdmin && !isOnLogin && !isLoggedIn) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    if (isOnLogin && isLoggedIn) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
