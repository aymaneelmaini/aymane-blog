import { Container } from '@/components/ui/container'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BlogCard } from '@/components/ui/blog-card'
import { db } from '@/lib/db'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Blog | Aymane El Maini',
    description: 'Thoughts on software development, architecture, and lessons learned.',
}

async function getPosts() {
    const posts = await db.post.findMany({
        where: { published: true },
        orderBy: { publishedAt: 'desc' },
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

// Demo posts for development
const demoPosts = [
    {
        id: '1',
        title: 'Building Scalable Microservices with Spring Boot',
        slug: 'scalable-microservices-spring-boot',
        excerpt:
            'Learn how to design and implement microservices that can handle millions of transactions.',
        publishedAt: new Date('2025-01-15'),
        readingTime: 8,
        coverUrl: null,
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

export default async function BlogPage() {
    const posts = await getPosts()
    const displayPosts = posts.length > 0 ? posts : demoPosts

    return (
        <>
            <Navigation />
            <main className="min-h-screen pt-24">
                <Container>
                    {/* Header */}
                    <div className="mb-16 max-w-2xl">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Thoughts on software development, architecture, and lessons learned
                            from building payment systems and enterprise applications.
                        </p>
                    </div>

                    {/* Posts Grid */}
                    <div className="grid gap-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
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

                    {/* Empty State */}
                    {displayPosts.length === 0 && (
                        <div className="py-24 text-center">
                            <p className="text-muted-foreground">No posts published yet.</p>
                        </div>
                    )}
                </Container>
            </main>
            <Footer />
        </>
    )
}
