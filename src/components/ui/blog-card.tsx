import { Calendar, Clock, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface BlogCardProps {
    title: string
    excerpt: string
    slug: string
    publishedAt: Date | null
    readingTime: number
    tags?: { name: string }[]
    coverUrl?: string | null
}

export function BlogCard({
    title,
    excerpt,
    slug,
    publishedAt,
    readingTime,
    tags = [],
    coverUrl,
}: BlogCardProps) {
    const formattedDate = publishedAt
        ? new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(new Date(publishedAt))
        : 'Draft'

    return (
        <Link
            href={`/blog/${slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-foreground/20 hover:shadow-sm"
        >
            {/* Cover Image */}
            {coverUrl && (
                <div className="relative aspect-[2/1] w-full overflow-hidden bg-muted">
                    <Image
                        src={coverUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                    />
                </div>
            )}

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
                {/* Tags */}
                {tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag.name}
                                className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold leading-snug transition-colors group-hover:text-accent">
                    {title}
                </h3>

                {/* Excerpt */}
                <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {readingTime} min
                        </span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
            </div>
        </Link>
    )
}
