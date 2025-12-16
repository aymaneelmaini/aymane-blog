import { Container } from '@/components/ui/container'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ProjectCard } from '@/components/ui/project-card'
import { GitHubRepoCard } from '@/components/ui/github-repo-card'
import projectsData from '@/data/projects.json'
import content from '@/data/content.json'
import { Metadata } from 'next'
import { GITHUB_REPOSITORY_URL } from '@/constants/links'
import { GitHubRepo } from '@/types/project'

export const metadata: Metadata = {
    title: content.pages.projects.metadata.title,
    description: content.pages.projects.metadata.description,
}

export const revalidate = 3600

function getProjects() {
    const projects = projectsData.projects
        .filter((p) => p.published)
        .sort((a, b) => {
            if (a.featured !== b.featured) return b.featured ? 1 : -1
            return a.id - b.id
        })

    return projects.map((project) => ({
        ...project,
        techStack: project.tags.map((tag) => ({ name: tag })),
    }))
}

async function getGitHubRepos(): Promise<GitHubRepo[]> {
    try {
        const response = await fetch(
            GITHUB_REPOSITORY_URL,
            {
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                },
                next: { revalidate: 3600 },
            }
        )

        if (!response.ok) {
            console.error('GitHub API error:', response.status)
            return []
        }

        const repos: GitHubRepo[] = await response.json()

        return repos
            .filter((repo) => !repo.fork && !repo.archived)
    } catch (error) {
        console.error('Failed to fetch GitHub repos:', error)
        return []
    }
}

export default async function ProjectsPage() {
    const projects = getProjects()
    const githubRepos = await getGitHubRepos()

    return (
        <>
            <Navigation />
            <main className="min-h-screen pt-24">
                <Container>
                    <div className="mb-16 max-w-2xl">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{content.pages.projects.title}</h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            {content.pages.projects.description}
                        </p>
                    </div>

                    {projects.length > 0 && (
                        <section className="mb-24">
                            <h2 className="mb-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                {content.pages.projects.featuredTitle}
                            </h2>
                            <div className="space-y-6">
                                {projects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        title={project.title}
                                        description={project.description}
                                        longDescription={project.longDescription}
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

                    {githubRepos.length > 0 && (
                        <section className="border-t border-dashed border-border pb-24 pt-16">
                            <div className="mb-8 flex items-center justify-between">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                    {content.pages.projects.openSourceTitle}
                                </h2>

                                <a href="https://github.com/AymaneTech"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                    {content.pages.projects.viewAllGithub}
                                </a>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {githubRepos.map((repo) => (
                                    <GitHubRepoCard key={repo.id} repo={repo} />
                                ))}
                            </div>
                        </section>
                    )}

                    {projects.length === 0 && githubRepos.length === 0 && (
                        <div className="py-24 text-center">
                            <p className="text-muted-foreground">{content.pages.projects.emptyState}</p>
                        </div>
                    )}
                </Container>
            </main >
            <Footer />
        </>
    )
}
