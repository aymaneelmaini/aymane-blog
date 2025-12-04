import { requireAuth } from '@/lib/auth'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Eye, EyeOff, Clock } from 'lucide-react'

async function getPosts() {
    return db.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            tags: { include: { tag: true } },
        },
    })
}

export default async function AdminPostsPage() {
    await requireAuth()
    const posts = await getPosts()

    const formatDate = (date: Date | null) => {
        if (!date) return 'Draft'
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(new Date(date))
    }

    return (
        <main className="min-h-screen py-12">
            <Container>
                <div className="mb-8">
                    <Link
                        href="/admin"
                        className="mb-4 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">Blog Posts</h1>
                        <Button asChild>
                            <Link href="/admin/posts/new">
                                <Plus className="mr-2 h-4 w-4" />
                                New Post
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card">
                    {posts.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-muted-foreground">No posts yet.</p>
                            <Button className="mt-4" asChild>
                                <Link href="/admin/posts/new">Create your first post</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/admin/posts/${post.id}`}
                                    className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-medium">{post.title}</h3>
                                        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                                            <span>{formatDate(post.publishedAt)}</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {post.readingTime} min
                                            </span>
                                            {post.tags.length > 0 && (
                                                <span>
                                                    {post.tags.map((t) => t.tag.name).join(', ')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${post.published
                                                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                                    : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                                }`}
                                        >
                                            {post.published ? (
                                                <>
                                                    <Eye className="h-3 w-3" /> Published
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="h-3 w-3" /> Draft
                                                </>
                                            )}
                                        </span>
                                        <Edit className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </main>
    )
}
