import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

interface BlogCardProps {
    title: string
    slug: string
    excerpt: string
    publishedAt: Date | null
    readingTime: number
    tags: { name: string }[]
}

export function BlogCard({
    title,
    slug,
    excerpt,
    publishedAt,
    readingTime,
    tags,
}: BlogCardProps) {
    const formattedDate = publishedAt
        ? new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(new Date(publishedAt))
        : 'Draft'

    return (
        <article className="group relative">
            <Link href={`/blog/${slug}`} className="block">
                <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-foreground/20 hover:shadow-sm">
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <time dateTime={publishedAt?.toISOString()}>{formattedDate}</time>
                        <span className="h-1 w-1 rounded-full bg-border" />
                        <span>{readingTime} min read</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-accent">
                        {title}
                    </h3>

                    {/* Excerpt */}
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {excerpt}
                    </p>

                    {/* Tags & Arrow */}
                    <div className="flex items-center justify-between border-t border-dashed border-border pt-4">
                        <div className="flex flex-wrap gap-2">
                            {tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag.name}
                                    className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                    </div>
                </div>
            </Link>
        </article>
    )
}
