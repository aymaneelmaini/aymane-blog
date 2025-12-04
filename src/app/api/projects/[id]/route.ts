import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

interface RouteParams {
    params: Promise<{ id: string }>
}

// GET single project
export async function GET(request: Request, { params }: RouteParams) {
    const { id } = await params

    try {
        const project = await db.project.findUnique({
            where: { id },
            include: {
                techStack: {
                    include: { tech: true },
                },
            },
        })

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        return NextResponse.json(project)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
    }
}

// PUT update project
export async function PUT(request: Request, { params }: RouteParams) {
    const session = await verifySession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    try {
        const body = await request.json()
        const { title, slug, description, thumbnailUrl, liveUrl, githubUrl, featured, published, order, techIds } = body

        // Check if slug exists on different project
        const existing = await db.project.findUnique({ where: { slug } })
        if (existing && existing.id !== id) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
        }

        // Delete existing tech relationships
        await db.projectTech.deleteMany({ where: { projectId: id } })

        // Update project
        const project = await db.project.update({
            where: { id },
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

        return NextResponse.json(project)
    } catch (error) {
        console.error('Update project error:', error)
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
    }
}

// DELETE project
export async function DELETE(request: Request, { params }: RouteParams) {
    const session = await verifySession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    try {
        await db.project.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
    }
}
