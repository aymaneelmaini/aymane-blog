import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function GET() {
    try {
        const skills = await db.skill.findMany({
            orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }],
        })
        return NextResponse.json(skills)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await verifySession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, category, iconUrl, order } = body

        // Check if skill with same name and category exists
        const existing = await db.skill.findUnique({
            where: { name_category: { name, category } },
        })

        if (existing) {
            return NextResponse.json(
                { error: 'Skill already exists in this category' },
                { status: 400 }
            )
        }

        const skill = await db.skill.create({
            data: {
                name,
                category,
                iconUrl: iconUrl || null,
                order: order || 0,
            },
        })

        return NextResponse.json(skill, { status: 201 })
    } catch (error) {
        console.error('Create skill error:', error)
        return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 })
    }
}
