import { requireAuth } from '@/lib/auth'
import { Container } from '@/components/ui/container'
import { PostForm } from '@/components/admin/post-form'
import { db } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{ id: string }>
}

async function getPost(id: string) {
    return db.post.findUnique({
        where: { id },
        include: {
            tags: { include: { tag: true } },
        },
    })
}

async function getTags() {
    return db.tag.findMany({ orderBy: { name: 'asc' } })
}

export default async function EditPostPage({ params }: PageProps) {
    await requireAuth()
    const { id } = await params

    const [post, tags] = await Promise.all([getPost(id), getTags()])

    if (!post) {
        notFound()
    }

    return (
        <main className="min-h-screen py-12">
            <Container>
                <div className="mx-auto max-w-3xl">
                    <Link
                        href="/admin/posts"
                        className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Posts
                    </Link>

                    <h1 className="mb-8 text-3xl font-bold">Edit Post</h1>

                    <div className="rounded-xl border border-border bg-card p-6">
                        <PostForm post={post} allTags={tags} />
                    </div>
                </div>
            </Container>
        </main>
    )
}
