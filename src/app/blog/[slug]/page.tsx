import { Container } from '@/components/ui/container'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Markdown } from '@/components/markdown'
import { FadeIn } from '@/components/ui/motion'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
    const post = await db.post.findUnique({
        where: { slug, published: true },
        include: {
            tags: {
                include: {
                    tag: true,
                },
            },
        },
    })

    if (!post) return null

    return {
        ...post,
        tags: post.tags.map((pt) => pt.tag),
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const post = await getPost(slug)

    if (!post) {
        return { title: 'Post Not Found' }
    }

    return {
        title: `${post.title} | Aymane El Maini`,
        description: post.excerpt,
    }
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params

    // Demo content for development
    const demoPost = {
        id: '1',
        title: 'Building Scalable Microservices with Spring Boot',
        slug: 'scalable-microservices-spring-boot',
        excerpt:
            'Learn how to design and implement microservices that can handle millions of transactions.',
        content: `
# Building Scalable Microservices with Spring Boot

Building microservices that can handle millions of transactions requires careful planning and the right architectural decisions. In this post, I'll share what I've learned building payment processing systems at ProgressSoft.

## Why Microservices?

Microservices architecture allows us to:

- **Scale independently** - Each service can be scaled based on its specific load
- **Deploy independently** - Teams can deploy without coordinating with others
- **Use different technologies** - Choose the best tool for each job

## Domain-Driven Design

At the core of our microservices architecture is Domain-Driven Design (DDD). Here's a simple example:

\`\`\`java
@Entity
public class Payment {
    @Id
    private PaymentId id;
    private Money amount;
    private PaymentStatus status;
    
    public void process() {
        if (this.status != PaymentStatus.PENDING) {
            throw new IllegalStateException("Payment already processed");
        }
        this.status = PaymentStatus.PROCESSING;
    }
}
\`\`\`

## Key Takeaways

1. Start with a clear domain model
2. Use event-driven communication between services
3. Implement proper error handling and retries
4. Monitor everything

> "The best architectures emerge from self-organizing teams" - Agile Manifesto

## Conclusion

Building scalable microservices is not just about technology—it's about understanding your domain and making the right trade-offs.

Feel free to reach out if you have questions!
    `,
        publishedAt: new Date('2025-01-15'),
        readingTime: 8,
        tags: [
            { id: '1', name: 'Java', slug: 'java' },
            { id: '2', name: 'Spring Boot', slug: 'spring-boot' },
            { id: '3', name: 'DDD', slug: 'ddd' },
        ],
    }

    const post = (await getPost(slug)) || (slug === 'scalable-microservices-spring-boot' ? demoPost : null)

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
                <Container>
                    <article className="mx-auto max-w-3xl pb-24">
                        {/* Back Button */}
                        <FadeIn>
                            <Button variant="ghost" size="sm" className="mb-8 -ml-2" asChild>
                                <Link href="/blog">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Blog
                                </Link>
                            </Button>
                        </FadeIn>

                        {/* Header */}
                        <header className="mb-12">
                            <FadeIn>
                                {/* Tags */}
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag.id}
                                            className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                                        >
                                            {tag.name}
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
                                        <span>{post.readingTime} min read</span>
                                    </div>
                                </div>
                            </FadeIn>
                        </header>

                        {/* Content */}
                        <FadeIn delay={0.1}>
                            <Markdown content={post.content} />
                        </FadeIn>

                        {/* Footer */}
                        <FadeIn delay={0.2}>
                            <div className="mt-16 border-t border-border pt-8">
                                <p className="text-muted-foreground">
                                    Thanks for reading! Feel free to{' '}
                                    <Link href="mailto:elmainiaymane03@gmail.com" className="text-accent hover:underline">
                                        reach out
                                    </Link>{' '}
                                    if you have any questions.
                                </p>
                            </div>
                        </FadeIn>
                    </article>
                </Container>
            </main>
            <Footer />
        </>
    )
}
