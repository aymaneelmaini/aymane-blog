import { Container } from '@/components/ui/container'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Markdown } from '@/components/markdown'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{ slug: string }>
}

const demoPosts: Record<string, {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    publishedAt: Date
    readingTime: number
    tags: { id: string; name: string; slug: string }[]
}> = {
    'scalable-microservices-spring-boot': {
        id: '1',
        title: 'Building Scalable Microservices with Spring Boot',
        slug: 'scalable-microservices-spring-boot',
        excerpt: 'Learn how to design and implement microservices that can handle millions of transactions.',
        content: `# Building Scalable Microservices with Spring Boot

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

Feel free to reach out if you have questions!`,
        publishedAt: new Date('2025-01-15'),
        readingTime: 8,
        tags: [
            { id: '1', name: 'Java', slug: 'java' },
            { id: '2', name: 'Spring Boot', slug: 'spring-boot' },
            { id: '3', name: 'DDD', slug: 'ddd' },
        ],
    },
    'payment-processing-lessons': {
        id: '2',
        title: 'Payment Processing: Lessons from the Trenches',
        slug: 'payment-processing-lessons',
        excerpt: 'Insights from building payment systems that handle SWIFT integrations and Visa transactions at scale.',
        content: `# Payment Processing: Lessons from the Trenches

Working with financial systems has taught me valuable lessons about building reliable software.

## The Complexity of Payments

Payment processing isn't just about moving money—it's about:

- **Compliance** - Meeting regulatory requirements
- **Security** - Protecting sensitive data
- **Reliability** - Ensuring transactions complete correctly

## SWIFT Integration

SWIFT messages follow strict formats. Here's a simplified example:

\`\`\`
{1:F01BANKUS33AXXX0000000000}
{2:I103BANKGB2LXXXXN}
{4:
:20:PAYMENT-REF-001
:32A:250115USD1000,00
:50K:/123456789
JOHN DOE
:59:/987654321
JANE SMITH
-}
\`\`\`

## Key Lessons

1. **Idempotency is critical** - Always handle duplicate requests gracefully
2. **Audit everything** - Keep detailed logs for compliance
3. **Plan for failures** - Network issues, timeouts, and partial failures happen

## Conclusion

Building payment systems requires attention to detail and a deep understanding of the domain.`,
        publishedAt: new Date('2025-01-10'),
        readingTime: 6,
        tags: [
            { id: '4', name: 'Fintech', slug: 'fintech' },
            { id: '5', name: 'Backend', slug: 'backend' },
        ],
    },
    'legacy-refactoring-strategies': {
        id: '3',
        title: 'From Legacy to Modern: Refactoring Strategies',
        slug: 'legacy-refactoring-strategies',
        excerpt: 'Practical approaches to refactoring legacy codebases while maintaining backward compatibility.',
        content: `# From Legacy to Modern: Refactoring Strategies

Refactoring legacy code is one of the most challenging tasks in software engineering.

## The Strangler Fig Pattern

Instead of rewriting everything at once, gradually replace parts of the system:

\`\`\`java
// Old service
@Deprecated
public class LegacyPaymentService {
    public void processPayment(PaymentRequest request) {
        // Old implementation
    }
}

// New service
public class ModernPaymentService {
    private final LegacyPaymentService legacy;
    
    public void processPayment(PaymentRequest request) {
        if (isModernFlow(request)) {
            // New implementation
        } else {
            legacy.processPayment(request);
        }
    }
}
\`\`\`

## Testing is Essential

Before refactoring, ensure you have comprehensive tests:

1. **Unit tests** - Test individual components
2. **Integration tests** - Test component interactions
3. **End-to-end tests** - Test complete workflows

## Conclusion

Take it slow, test thoroughly, and refactor incrementally.`,
        publishedAt: new Date('2025-01-05'),
        readingTime: 10,
        tags: [
            { id: '6', name: 'Refactoring', slug: 'refactoring' },
            { id: '7', name: 'Best Practices', slug: 'best-practices' },
        ],
    },
}

async function getPost(slug: string) {
    // First try to get from database
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

    if (post) {
        return {
            ...post,
            tags: post.tags.map((pt) => pt.tag),
        }
    }

    // Fallback to demo posts
    return demoPosts[slug] || null
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
    const post = await getPost(slug)

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
                        <div>
                            <Button variant="ghost" size="sm" className="mb-8 -ml-2" asChild>
                                <Link href="/blog">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Blog
                                </Link>
                            </Button>
                        </div>

                        {/* Header */}
                        <header className="mb-12">
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
                        </header>

                        {/* Content */}
                        <Markdown content={post.content} />

                        {/* Footer */}
                        <div className="mt-16 border-t border-dashed border-border pt-8">
                            <p className="text-muted-foreground">
                                Thanks for reading! Feel free to{' '}
                                <Link href="mailto:elmainiaymane03@gmail.com" className="text-accent hover:underline">
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
