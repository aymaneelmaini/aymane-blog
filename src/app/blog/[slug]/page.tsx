import { Container } from '@/components/ui/container'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Markdown } from '@/components/markdown'
import { Button } from '@/components/ui/button'
import { getPostBySlug, getAllPostSlugs } from '@/lib/blog'
import content from '@/data/content.json'
import profileData from '@/data/profile.json'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{ slug: string }>
}

function getPost(slug: string) {
    return getPostBySlug(slug)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const post = getPost(slug)

    if (!post) {
        return { title: content.pages.blogPost.notFound }
    }

    return {
        title: `${post.title} | ${content.site.name}`,
        description: post.excerpt,
    }
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params
    const post = getPost(slug)

    if (!post) {
        notFound()
    }

    const formattedDate = post.publishedAt
        ? new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }).format(new Date(post.publishedAt))
        : 'Draft'

    return (
        <>
            <Navigation />
            <main className="min-h-screen pt-24">
                {/* Cover Image - Full Width */}
                {post.coverUrl && (
                    <div className="relative mx-auto mb-12 h-64 max-w-5xl overflow-hidden rounded-xl sm:h-80 md:h-96 lg:h-[28rem]">
                        <Image
                            src={post.coverUrl}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                            unoptimized
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                )}

                <Container>
                    <article className="mx-auto max-w-3xl pb-24">
                        {/* Back Button */}
                        <div>
                            <Button variant="ghost" size="sm" className="mb-8 -ml-2" asChild>
                                <Link href="/blog">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    {content.pages.blogPost.backButton}
                                </Link>
                            </Button>
                        </div>

                        {/* Header */}
                        <header className="mb-12">
                            {/* Tags */}
                            <div className="mb-4 flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                                {post.title}
                            </h1>

                            {/* Meta */}
                            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    <time dateTime={post.publishedAt?.toISOString()}>{formattedDate}</time>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    <span>{post.readingTime} {content.pages.blogPost.readingTime}</span>
                                </div>
                            </div>
                        </header>

                        {/* Content */}
                        <Markdown content={post.content} />

                        {/* Footer */}
                        <div className="mt-16 border-t border-dashed border-border pt-8">
                            <p className="text-muted-foreground">
                                Thanks for reading! Feel free to{' '}
                                <Link href={`mailto:${profileData.profile.email}`} className="text-accent hover:underline">
                                    reach out
                                </Link>{' '}
                                if you have any questions.
                            </p>
                        </div>
                    </article>
                </Container>
            </main>
            <Footer />
        </>
    )
}
