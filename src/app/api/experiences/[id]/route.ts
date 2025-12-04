import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

interface RouteParams {
    params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
    const { id } = await params

    try {
        const experience = await db.experience.findUnique({
            where: { id },
        })

        if (!experience) {
            return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
        }

        return NextResponse.json(experience)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 })
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
        const { company, role, description, logoUrl, startDate, endDate, current, order } = body

        const experience = await db.experience.update({
            where: { id },
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

        return NextResponse.json(experience)
    } catch (error) {
        console.error('Update experience error:', error)
        return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    const session = await verifySession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    try {
        await db.experience.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 })
    }
}
