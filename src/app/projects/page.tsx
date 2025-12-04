import { Container } from '@/components/ui/container'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ProjectCard } from '@/components/ui/project-card'
import { GitHubRepoCard } from '@/components/ui/github-repo-card'
import { db } from '@/lib/db'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Projects | Aymane El Maini',
    description: 'A collection of projects I\'ve built, from payment systems to full-stack applications.',
}

// Revalidate every hour
export const revalidate = 3600

async function getProjects() {
    const projects = await db.project.findMany({
        where: { published: true },
        orderBy: [{ featured: 'desc' }, { order: 'asc' }],
        include: {
            techStack: {
                include: { tech: true },
            },
        },
    })

    return projects.map((project) => ({
        ...project,
        techStack: project.techStack.map((pt) => ({ name: pt.tech.name })),
    }))
}

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
    fork: boolean
    archived: boolean
    updated_at: string
}

async function getGitHubRepos(): Promise<GitHubRepo[]> {
    try {
        const response = await fetch(
            'https://api.github.com/users/AymaneTech/repos?sort=updated&per_page=100',
            {
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                    // Add token if you have one for higher rate limits
                    // Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                },
                next: { revalidate: 3600 }, // Cache for 1 hour
            }
        )

        if (!response.ok) {
            console.error('GitHub API error:', response.status)
            return []
        }

        const repos: GitHubRepo[] = await response.json()

        // Filter out forks and archived repos, sort by stars then updated
        return repos
            .filter((repo) => !repo.fork && !repo.archived)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
    } catch (error) {
        console.error('Failed to fetch GitHub repos:', error)
        return []
    }
}

export default async function ProjectsPage() {
    const [projects, githubRepos] = await Promise.all([
        getProjects(),
        getGitHubRepos(),
    ])

    return (
        <>
            <Navigation />
            <main className="min-h-screen pt-24">
                <Container>
                    {/* Header */}
                    <div className="mb-16 max-w-2xl">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Projects</h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            A collection of projects I've built, from payment processing systems
                            to full-stack applications. Some are from work, others are personal experiments.
                        </p>
                    </div>

                    {/* Featured Projects from DB */}
                    {projects.length > 0 && (
                        <section className="mb-24">
                            <h2 className="mb-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Featured Projects
                            </h2>
                            <div className="grid gap-6 sm:grid-cols-2">
                                {projects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        title={project.title}
                                        description={project.description}
                                        slug={project.slug}
                                        thumbnailUrl={project.thumbnailUrl}
                                        liveUrl={project.liveUrl}
                                        githubUrl={project.githubUrl}
                                        techStack={project.techStack}
                                        featured={project.featured}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* GitHub Repos */}
                    {githubRepos.length > 0 && (
                        <section className="border-t border-dashed border-border pb-24 pt-16">
                            <div className="mb-8 flex items-center justify-between">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                    Open Source & GitHub
                                </h2>

                                <a href="https://github.com/AymaneTech"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                    View all on GitHub →
                                </a>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {githubRepos.map((repo) => (
                                    <GitHubRepoCard key={repo.id} repo={repo} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Empty State */}
                    {projects.length === 0 && githubRepos.length === 0 && (
                        <div className="py-24 text-center">
                            <p className="text-muted-foreground">No projects to show yet.</p>
                        </div>
                    )}
                </Container>
            </main >
            <Footer />
        </>
    )
}
