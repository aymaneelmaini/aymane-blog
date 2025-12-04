import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnAdmin = req.nextUrl.pathname.startsWith('/admin')
    const isOnLogin = req.nextUrl.pathname === '/admin/login'

    // If on admin pages (except login) and not logged in, redirect to login
    if (isOnAdmin && !isOnLogin && !isLoggedIn) {
        return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
    }

    // If on login page and already logged in, redirect to admin
    if (isOnLogin && isLoggedIn) {
        return NextResponse.redirect(new URL('/admin', req.nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/admin/:path*'],
}
