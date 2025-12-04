import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function GET() {
    try {
        const experiences = await db.experience.findMany({
            orderBy: [{ current: 'desc' }, { startDate: 'desc' }],
        })
        return NextResponse.json(experiences)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await verifySession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { company, role, description, logoUrl, startDate, endDate, current, order } = body

        const experience = await db.experience.create({
            data: {
                company,
                role,
                description: description || null,
                logoUrl: logoUrl || null,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                current,
                order,
            },
        })

        return NextResponse.json(experience, { status: 201 })
    } catch (error) {
        console.error('Create experience error:', error)
        return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
    }
}
