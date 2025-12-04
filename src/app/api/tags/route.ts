import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function GET() {
    try {
        const tags = await db.tag.findMany({ orderBy: { name: 'asc' } })
        return NextResponse.json(tags)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await verifySession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { name } = await request.json()
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

        const existing = await db.tag.findUnique({ where: { slug } })
        if (existing) {
            return NextResponse.json(existing)
        }

        const tag = await db.tag.create({
            data: { name, slug },
        })

        return NextResponse.json(tag, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 })
    }
}
