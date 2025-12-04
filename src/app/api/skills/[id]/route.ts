import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

interface RouteParams {
    params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
    const { id } = await params

    try {
        const skill = await db.skill.findUnique({
            where: { id },
        })

        if (!skill) {
            return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
        }

        return NextResponse.json(skill)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch skill' }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: RouteParams) {
    const session = await verifySession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    try {
        const body = await request.json()
        const { name, category, iconUrl, order } = body

        // Check if another skill with same name and category exists
        const existing = await db.skill.findUnique({
            where: { name_category: { name, category } },
        })

        if (existing && existing.id !== id) {
            return NextResponse.json(
                { error: 'Skill already exists in this category' },
                { status: 400 }
            )
        }

        const skill = await db.skill.update({
            where: { id },
            data: {
                name,
                category,
                iconUrl: iconUrl || null,
                order,
            },
        })

        return NextResponse.json(skill)
    } catch (error) {
        console.error('Update skill error:', error)
        return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    const session = await verifySession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    try {
        await db.skill.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 })
    }
}
