import { cn } from '@/lib/utils'
import { ArrowUpRight, Github } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ProjectCardProps {
    title: string
    description: string
    slug: string
    thumbnailUrl?: string | null
    liveUrl?: string | null
    githubUrl?: string | null
    techStack: { name: string }[]
    featured?: boolean
}

export function ProjectCard({
    title,
    description,
    slug,
    thumbnailUrl,
    liveUrl,
    githubUrl,
    techStack,
    featured = false,
}: ProjectCardProps) {
    return (
        <article
            className={cn(
                'group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200',
                'hover:border-foreground/20 hover:shadow-sm',
                featured && 'md:col-span-2'
            )}
        >
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {thumbnailUrl ? (
                    <Image
                        src={thumbnailUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center border-b border-dashed border-border">
                        <span className="text-5xl font-bold text-muted-foreground/20">
                            {title.charAt(0)}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6">
                {/* Title & Links */}
                <div className="mb-3 flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
                    <div className="flex items-center gap-1">
                        {githubUrl && (
                            <Link
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                aria-label={`${title} GitHub repository`}
                            >
                                <Github className="h-4 w-4" />
                            </Link>
                        )}
                        {liveUrl && (
                            <Link
                                href={liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                aria-label={`${title} live demo`}
                            >
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Description */}
                <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 border-t border-dashed border-border pt-4">
                    {techStack.map((tech) => (
                        <span
                            key={tech.name}
                            className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                        >
                            {tech.name}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    )
}
