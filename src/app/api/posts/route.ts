import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function GET() {
    try {
        const posts = await db.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                tags: { include: { tag: true } },
            },
        })
        return NextResponse.json(posts)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await verifySession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { title, slug, excerpt, content, coverUrl, readingTime, published, tagIds } = body

        const existing = await db.post.findUnique({ where: { slug } })
        if (existing) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
        }

        const post = await db.post.create({
            data: {
                title,
                slug,
                excerpt,
                content,
                coverUrl: coverUrl || null,
                readingTime,
                published,
                publishedAt: published ? new Date() : null,
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

        return NextResponse.json(post, { status: 201 })
    } catch (error) {
        console.error('Create post error:', error)
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }
}
