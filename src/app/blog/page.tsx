import { Container } from '@/components/ui/container'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BlogCard } from '@/components/ui/blog-card'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion'
import { db } from '@/lib/db'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Blog | Aymane El Maini',
    description: 'Thoughts on software engineering, backend development, and lessons learned.',
}

async function getPosts() {
    const posts = await db.post.findMany({
        where: { published: true },
        orderBy: { publishedAt: 'desc' },
        include: {
            tags: {
                include: {
                    tag: true,
                },
            },
        },
    })

    return posts.map((post) => ({
        ...post,
        tags: post.tags.map((pt) => ({ name: pt.tag.name })),
    }))
}

export default async function BlogPage() {
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
                        'Learn how to design and implement microservices that can handle millions of transactions using Spring Boot and Domain-Driven Design.',
                    publishedAt: new Date('2025-01-15'),
                    readingTime: 8,
                    tags: [{ name: 'Java' }, { name: 'Spring Boot' }, { name: 'DDD' }],
                },
                {
                    id: '2',
                    title: 'Payment Processing: Lessons from the Trenches',
                    slug: 'payment-processing-lessons',
                    excerpt:
                        'Insights from building payment systems that handle SWIFT integrations and Visa transactions at scale.',
                    publishedAt: new Date('2025-01-10'),
                    readingTime: 6,
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
                    tags: [{ name: 'Refactoring' }, { name: 'Best Practices' }],
                },
                {
                    id: '4',
                    title: 'Kotlin Coroutines for Backend Developers',
                    slug: 'kotlin-coroutines-backend',
                    excerpt:
                        'A practical guide to using Kotlin coroutines for building high-performance, non-blocking backend services.',
                    publishedAt: new Date('2024-12-20'),
                    readingTime: 12,
                    tags: [{ name: 'Kotlin' }, { name: 'Async' }],
                },
            ]

    return (
        <>
            <Navigation />
            <main className="min-h-screen pt-24">
                <Container>
                    {/* Header */}
                    <FadeIn>
                        <div className="mb-16 max-w-2xl">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Thoughts on software engineering, backend development, and lessons
                                learned building scalable systems.
                            </p>
                        </div>
                    </FadeIn>

                    {/* Posts Grid */}
                    <StaggerContainer className="grid gap-6 pb-24 sm:grid-cols-2" staggerDelay={0.1}>
                        {displayPosts.map((post) => (
                            <StaggerItem key={post.id}>
                                <BlogCard
                                    title={post.title}
                                    slug={post.slug}
                                    excerpt={post.excerpt}
                                    publishedAt={post.publishedAt}
                                    readingTime={post.readingTime}
                                    tags={post.tags}
                                />
                            </StaggerItem>
                        ))}
                    </StaggerContainer>

                    {/* Empty State */}
                    {displayPosts.length === 0 && (
                        <FadeIn>
                            <div className="py-24 text-center">
                                <p className="text-muted-foreground">No posts yet. Check back soon!</p>
                            </div>
                        </FadeIn>
                    )}
                </Container>
            </main>
            <Footer />
        </>
    )
}
