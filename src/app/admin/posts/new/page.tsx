import { requireAuth } from '@/lib/auth'
import { Container } from '@/components/ui/container'
import { PostForm } from '@/components/admin/post-form'
import { db } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

async function getTags() {
    return db.tag.findMany({ orderBy: { name: 'asc' } })
}

export default async function NewPostPage() {
    await requireAuth()
    const tags = await getTags()

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

                    <h1 className="mb-8 text-3xl font-bold">New Post</h1>

                    <div className="rounded-xl border border-border bg-card p-6">
                        <PostForm allTags={tags} />
                    </div>
                </div>
            </Container>
        </main>
    )
}
