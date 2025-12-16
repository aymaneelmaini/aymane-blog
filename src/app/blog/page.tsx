import { Container } from '@/components/ui/container'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BlogCard } from '@/components/ui/blog-card'
import { getAllPosts } from '@/lib/blog'
import content from '@/data/content.json'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: content.pages.blog.metadata.title,
    description: content.pages.blog.metadata.description,
}

export default function BlogPage() {
    const posts = getAllPosts()
    const displayPosts = posts.map((post) => ({
        ...post,
        tags: post.tags.map((tag) => ({ name: tag })),
    }))

    return (
        <>
            <Navigation />
            <main className="min-h-screen pt-24">
                <Container>
                    {/* Header */}
                    <div className="mb-16 max-w-2xl">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{content.pages.blog.title}</h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            {content.pages.blog.description}
                        </p>
                    </div>

                    {/* Posts List */}
                    <div className="space-y-6 pb-24">
                        {displayPosts.map((post) => (
                            <BlogCard
                                key={post.slug}
                                title={post.title}
                                excerpt={post.excerpt}
                                slug={post.slug}
                                publishedAt={post.publishedAt}
                                readingTime={post.readingTime}
                                tags={post.tags}
                                coverUrl={post.coverUrl}
                            />
                        ))}
                    </div>

                    {/* Empty State */}
                    {displayPosts.length === 0 && (
                        <div className="py-24 text-center">
                            <p className="text-muted-foreground">{content.pages.blog.emptyState}</p>
                        </div>
                    )}
                </Container>
            </main>
            <Footer />
        </>
    )
}
