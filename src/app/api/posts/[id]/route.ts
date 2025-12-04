import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

interface RouteParams {
    params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
    const { id } = await params

    try {
        const post = await db.post.findUnique({
            where: { id },
            include: {
                tags: { include: { tag: true } },
            },
        })

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        return NextResponse.json(post)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
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
        const { title, slug, excerpt, content, coverUrl, readingTime, published, tagIds } = body

        const existing = await db.post.findUnique({ where: { slug } })
        if (existing && existing.id !== id) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
        }

        // Get current post to check publish status change
        const currentPost = await db.post.findUnique({ where: { id } })

        await db.postTag.deleteMany({ where: { postId: id } })

        const post = await db.post.update({
            where: { id },
            data: {
                title,
                slug,
                excerpt,
                content,
                coverUrl: coverUrl || null,
                readingTime,
                published,
                publishedAt: published && !currentPost?.publishedAt ? new Date() : currentPost?.publishedAt,
                tags: {
                    create: tagIds.map((tagId: string) => ({
                        tag: { connect: { id: tagId } },
                    })),
                },
            },
            include: {
                tags: { include: { tag: true } },
            },
        })

        return NextResponse.json(post)
    } catch (error) {
        console.error('Update post error:', error)
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    const session = await verifySession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    try {
        await db.post.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
    }
}
