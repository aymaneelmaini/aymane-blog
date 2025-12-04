import { requireAuth } from '@/lib/auth'
import { Container } from '@/components/ui/container'
import { ProjectForm } from '@/components/admin/project-form'
import { db } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{ id: string }>
}

async function getProject(id: string) {
    return db.project.findUnique({
        where: { id },
        include: {
            techStack: {
                include: { tech: true },
            },
        },
    })
}

async function getTechs() {
    return db.tech.findMany({ orderBy: { name: 'asc' } })
}

export default async function EditProjectPage({ params }: PageProps) {
    await requireAuth()
    const { id } = await params

    const [project, techs] = await Promise.all([getProject(id), getTechs()])

    if (!project) {
        notFound()
    }

    return (
        <main className="min-h-screen py-12">
            <Container>
                <div className="mx-auto max-w-2xl">
                    <Link
                        href="/admin/projects"
                        className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Projects
                    </Link>

                    <h1 className="mb-8 text-3xl font-bold">Edit Project</h1>

                    <div className="rounded-xl border border-border bg-card p-6">
                        <ProjectForm project={project} allTechs={techs} />
                    </div>
                </div>
            </Container>
        </main>
    )
}
