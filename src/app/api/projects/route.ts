import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

// GET all projects (public)
export async function GET() {
    try {
        const projects = await db.project.findMany({
            orderBy: [{ featured: 'desc' }, { order: 'asc' }],
            include: {
                techStack: {
                    include: { tech: true },
                },
            },
        })
        return NextResponse.json(projects)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
    }
}

// POST create project (protected)
export async function POST(request: Request) {
    const session = await verifySession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { title, slug, description, thumbnailUrl, liveUrl, githubUrl, featured, published, order, techIds } = body

        const existing = await db.project.findUnique({ where: { slug } })
        if (existing) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
        }

        const project = await db.project.create({
            data: {
                title,
                slug,
                description,
                thumbnailUrl: thumbnailUrl || null,
                liveUrl: liveUrl || null,
                githubUrl: githubUrl || null,
                featured,
                published,
                order,
                techStack: {
                    create: techIds.map((techId: string) => ({
                        tech: { connect: { id: techId } },
                    })),
                },
            },
            include: {
                techStack: {
                    include: { tech: true },
                },
            },
        })

        return NextResponse.json(project, { status: 201 })
    } catch (error) {
        console.error('Create project error:', error)
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
    }
}
