import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { BlogCard } from '@/components/ui/blog-card'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import Link from 'next/link'

async function getPosts() {
    const posts = await db.post.findMany({
        where: { published: true },
        orderBy: { publishedAt: 'desc' },
        take: 3,
        include: {
            tags: {
                include: { tag: true },
            },
        },
    })

    return posts.map((post) => ({
        ...post,
        tags: post.tags.map((pt) => ({ name: pt.tag.name })),
    }))
}

export async function BlogSection() {
    const posts = await getPosts()

    const displayPosts =
        posts.length > 0
            ? posts
            : [
                {
                    id: '1',
                    title: 'Building Scalable Microservices with Spring Boot',
                    slug: 'scalable-microservices-spring-boot',
                    excerpt:
                        'Learn how to design and implement microservices that can handle millions of transactions.',
                    publishedAt: new Date('2025-01-15'),
                    readingTime: 8,
                    coverUrl: null,
                    tags: [{ name: 'Java' }, { name: 'Spring Boot' }],
                },
                {
                    id: '2',
                    title: 'Payment Processing: Lessons from the Trenches',
                    slug: 'payment-processing-lessons',
                    excerpt:
                        'Insights from building payment systems that handle SWIFT integrations and Visa transactions at scale.',
                    publishedAt: new Date('2025-01-10'),
                    readingTime: 6,
                    coverUrl: null,
                    tags: [{ name: 'Fintech' }, { name: 'Backend' }],
                },
                {
                    id: '3',
                    title: 'From Legacy to Modern: Refactoring Strategies',
                    slug: 'legacy-refactoring-strategies',
                    excerpt:
                        'Practical approaches to refactoring legacy codebases while maintaining backward compatibility.',
                    publishedAt: new Date('2025-01-05'),
                    readingTime: 10,
                    coverUrl: null,
                    tags: [{ name: 'Refactoring' }, { name: 'Best Practices' }],
                },
            ]

    return (
        <section id="blog" className="border-t border-dashed border-border py-24 sm:py-32">
            <Container>
                <div className="flex items-end justify-between gap-4">
                    <SectionHeader
                        title="Blog"
                        description="Thoughts on software development, architecture, and lessons learned."
                    />
                    <Button variant="ghost" asChild className="hidden sm:inline-flex">
                        <Link href="/blog">View all posts</Link>
                    </Button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {displayPosts.map((post) => (
                        <BlogCard
                            key={post.id}
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
                        <Link href="/blog">View all posts</Link>
                    </Button>
                </div>
            </Container>
        </section>
    )
}
