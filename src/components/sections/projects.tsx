import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { ProjectCard } from '@/components/ui/project-card'
import { db } from '@/lib/db'

async function getProjects() {
    const projects = await db.project.findMany({
        where: { published: true },
        orderBy: [{ featured: 'desc' }, { order: 'asc' }],
        take: 4,
        include: {
            techStack: {
                include: {
                    tech: true,
                },
            },
        },
    })

    return projects.map((project) => ({
        ...project,
        techStack: project.techStack.map((pt) => ({ name: pt.tech.name })),
    }))
}

export async function ProjectsSection() {
    const projects = await getProjects()

    if (projects.length === 0) {
        return null
    }

    return (
        <section id="projects" className="py-24 sm:py-32">
            <Container>
                <SectionHeader
                    title="Projects"
                    description="A selection of projects I've worked on, from payment systems to full-stack applications."
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
