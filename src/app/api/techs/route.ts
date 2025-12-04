import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

// GET all techs
export async function GET() {
    try {
        const techs = await db.tech.findMany({
            orderBy: { name: 'asc' },
        })
        return NextResponse.json(techs)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch techs' }, { status: 500 })
    }
}

// POST create tech
export async function POST(request: Request) {
    const session = await verifySession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { name } = await request.json()

        // Check if exists
        const existing = await db.tech.findUnique({ where: { name } })
        if (existing) {
            return NextResponse.json(existing)
        }

        const tech = await db.tech.create({
            data: { name },
        })

        return NextResponse.json(tech, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create tech' }, { status: 500 })
    }
}
