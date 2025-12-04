import { Star, GitFork, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface GitHubRepo {
    id: number
    name: string
    description: string | null
    html_url: string
    homepage: string | null
    stargazers_count: number
    forks_count: number
    language: string | null
    topics: string[]
    updated_at: string
}

interface GitHubRepoCardProps {
    repo: GitHubRepo
}

const languageColors: Record<string, string> = {
    TypeScript: 'bg-blue-500',
    JavaScript: 'bg-yellow-400',
    Java: 'bg-orange-500',
    Kotlin: 'bg-purple-500',
    Python: 'bg-green-500',
    PHP: 'bg-indigo-400',
    HTML: 'bg-red-500',
    CSS: 'bg-pink-500',
    Shell: 'bg-green-400',
    Dockerfile: 'bg-blue-400',
    Go: 'bg-cyan-500',
    Rust: 'bg-orange-600',
    C: 'bg-gray-500',
    'C++': 'bg-pink-600',
    'C#': 'bg-green-600',
    Ruby: 'bg-red-600',
    Swift: 'bg-orange-400',
}

export function GitHubRepoCard({ repo }: GitHubRepoCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - date.getTime())
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays} days ago`
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
        return `${Math.floor(diffDays / 365)} years ago`
    }

    return (
        <Link
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:border-foreground/20 hover:shadow-sm"
        >
            {/* Header */}
            <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className="font-medium text-foreground transition-colors group-hover:text-accent">
                    {repo.name}
                </h3>
                <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>

            {/* Description */}
            <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {repo.description || 'No description'}
            </p>

            {/* Topics */}
            {repo.topics.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1.5">
                    {repo.topics.slice(0, 4).map((topic) => (
                        <span
                            key={topic}
                            className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent"
                        >
                            {topic}
                        </span>
                    ))}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {/* Language */}
                {repo.language && (
                    <span className="flex items-center gap-1.5">
                        <span
                            className={`h-2.5 w-2.5 rounded-full ${languageColors[repo.language] || 'bg-gray-400'
                                }`}
                        />
                        {repo.language}
                    </span>
                )}

                {/* Stars */}
                {repo.stargazers_count > 0 && (
                    <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" />
                        {repo.stargazers_count}
                    </span>
                )}

                {/* Forks */}
                {repo.forks_count > 0 && (
                    <span className="flex items-center gap-1">
                        <GitFork className="h-3.5 w-3.5" />
                        {repo.forks_count}
                    </span>
                )}

                {/* Updated */}
                <span className="ml-auto">{formatDate(repo.updated_at)}</span>
            </div>
        </Link>
    )
}
