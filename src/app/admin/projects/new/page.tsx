import { requireAuth } from '@/lib/auth'
import { Container } from '@/components/ui/container'
import { ProjectForm } from '@/components/admin/project-form'
import { db } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

async function getTechs() {
    return db.tech.findMany({ orderBy: { name: 'asc' } })
}

export default async function NewProjectPage() {
    await requireAuth()
    const techs = await getTechs()

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

                    <h1 className="mb-8 text-3xl font-bold">New Project</h1>

                    <div className="rounded-xl border border-border bg-card p-6">
                        <ProjectForm allTechs={techs} />
                    </div>
                </div>
            </Container>
        </main>
    )
}
