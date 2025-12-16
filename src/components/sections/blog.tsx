import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { BlogCard } from '@/components/ui/blog-card'
import { Button } from '@/components/ui/button'
import { getAllPosts } from '@/lib/blog'
import content from '@/data/content.json'
import Link from 'next/link'

function getPosts() {
    const allPosts = getAllPosts()
    return allPosts.slice(0, 3).map((post) => ({
        ...post,
        tags: post.tags.map((tag) => ({ name: tag })),
    }))
}

export function BlogSection() {
    const posts = getPosts()

    if (posts.length === 0) {
        return null
    }

    return (
        <section id="blog" className="border-t border-dashed border-border py-24 sm:py-32">
            <Container>
                <div className="flex items-end justify-between gap-4">
                    <SectionHeader
                        title={content.sections.blog.title}
                        description={content.sections.blog.description}
                    />
                    <Button variant="ghost" asChild className="hidden sm:inline-flex">
                        <Link href="/blog">{content.sections.blog.viewAllText}</Link>
                    </Button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
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

                <div className="mt-8 text-center sm:hidden">
                    <Button variant="secondary" asChild>
                        <Link href="/blog">{content.sections.blog.viewAllText}</Link>
                    </Button>
                </div>
            </Container>
        </section>
    )
}
