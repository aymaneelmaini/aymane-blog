import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const secretKey = process.env.AUTH_SECRET!
const encodedKey = new TextEncoder().encode(secretKey)

// Session duration: 7 days
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

interface SessionPayload {
    userId: string
    email: string
    expiresAt: Date
}

export async function createSession(email: string) {
    const expiresAt = new Date(Date.now() + SESSION_DURATION)

    const session = await new SignJWT({ userId: '1', email })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresAt)
        .sign(encodedKey)

    const cookieStore = await cookies()
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}

export async function verifySession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies()
    const cookie = cookieStore.get('session')?.value

    if (!cookie) return null

    try {
        const { payload } = await jwtVerify(cookie, encodedKey, {
            algorithms: ['HS256'],
        })

        return {
            userId: payload.userId as string,
            email: payload.email as string,
            expiresAt: new Date(payload.exp! * 1000),
        }
    } catch (error) {
        return null
    }
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}

export async function getSession() {
    const session = await verifySession()
    if (!session) return null

    return {
        user: {
            id: session.userId,
            email: session.email,
        },
    }
}

export async function requireAuth() {
    const session = await getSession()
    if (!session) {
        redirect('/admin/login')
    }
    return session
}

export function verifyCredentials(email: string, password: string): boolean {
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
        console.error('ADMIN_EMAIL or ADMIN_PASSWORD not set in environment')
        return false
    }

    return email === adminEmail && password === adminPassword
}
