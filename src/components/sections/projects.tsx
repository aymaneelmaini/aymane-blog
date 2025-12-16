import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { ProjectCard } from '@/components/ui/project-card'
import projectsData from '@/data/projects.json'
import content from '@/data/content.json'

function getProjects() {
    const projects = projectsData.projects
        .filter((p) => p.published)
        .sort((a, b) => {
            if (a.featured !== b.featured) return b.featured ? 1 : -1
            return a.id - b.id
        })
        .slice(0, 4)

    return projects.map((project) => ({
        ...project,
        techStack: project.tags.map((tag) => ({ name: tag })),
    }))
}

export function ProjectsSection() {
    const projects = getProjects()

    if (projects.length === 0) {
        return null
    }

    return (
        <section id="projects" className="py-24 sm:py-32">
            <Container>
                <SectionHeader
                    title={content.sections.projects.title}
                    description={content.sections.projects.description}
                />

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
            </Container>
        </section>
    )
}
