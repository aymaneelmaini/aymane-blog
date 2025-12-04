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

    const displayProjects =
        projects.length > 0
            ? projects
            : [
                {
                    id: '1',
                    title: 'Payment Processing Platform',
                    slug: 'payment-platform',
                    description:
                        'Scalable microservices architecture handling SWIFT integrations and Visa transactions for global financial operations.',
                    thumbnailUrl: null,
                    liveUrl: null,
                    githubUrl: 'https://github.com/aymaneelmaini',
                    techStack: [
                        { name: 'Java' },
                        { name: 'Spring Boot' },
                        { name: 'Kafka' },
                        { name: 'PostgreSQL' },
                    ],
                    featured: true,
                },
                {
                    id: '2',
                    title: 'Food Deals Platform',
                    slug: 'food-deals',
                    description:
                        'Full-stack application connecting users with local restaurant deals. Built with Spring Boot and Angular.',
                    thumbnailUrl: null,
                    liveUrl: null,
                    githubUrl: 'https://github.com/aymaneelmaini',
                    techStack: [
                        { name: 'Spring Boot' },
                        { name: 'Angular' },
                        { name: 'Docker' },
                        { name: 'MySQL' },
                    ],
                    featured: false,
                },
                {
                    id: '3',
                    title: 'Developer Portfolio',
                    slug: 'portfolio',
                    description:
                        'Modern portfolio website built with Next.js, featuring dark mode, blog with Markdown, and admin panel.',
                    thumbnailUrl: null,
                    liveUrl: 'https://aymaneelmaini.vercel.app',
                    githubUrl: 'https://github.com/aymaneelmaini',
                    techStack: [
                        { name: 'Next.js' },
                        { name: 'TypeScript' },
                        { name: 'Prisma' },
                        { name: 'Tailwind' },
                    ],
                    featured: false,
                },
            ]

    return (
        <section id="projects" className="py-24 sm:py-32">
            <Container>
                <SectionHeader
                    title="Projects"
                    description="A selection of projects I've worked on, from payment systems to full-stack applications."
                />

                <div className="grid gap-6 sm:grid-cols-2">
                    {displayProjects.map((project) => (
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
