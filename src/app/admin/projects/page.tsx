import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/ui/motion'
import { db } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Eye, EyeOff } from 'lucide-react'

async function getProjects() {
    return db.project.findMany({
        orderBy: [{ featured: 'desc' }, { order: 'asc' }],
        include: {
            techStack: {
                include: { tech: true },
            },
        },
    })
}

export default async function AdminProjectsPage() {
    const session = await auth()
    if (!session) redirect('/admin/login')

    const projects = await getProjects()

    return (
        <main className="min-h-screen py-12">
            <Container>
                {/* Header */}
                <FadeIn>
                    <div className="mb-8">
                        <Link
                            href="/admin"
                            className="mb-4 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold">Projects</h1>
                            <Button asChild>
                                <Link href="/admin/projects/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Project
                                </Link>
                            </Button>
                        </div>
                    </div>
                </FadeIn>

                {/* Projects List */}
                <FadeIn delay={0.1}>
                    <div className="rounded-xl border border-border bg-card">
                        {projects.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-muted-foreground">No projects yet.</p>
                                <Button className="mt-4" asChild>
                                    <Link href="/admin/projects/new">Create your first project</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg font-bold text-muted-foreground">
                                                {project.title.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium">{project.title}</h3>
                                                    {project.featured && (
                                                        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {project.techStack.map((pt) => pt.tech.name).join(', ')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${project.published
                                                        ? 'bg-green-500/10 text-green-500'
                                                        : 'bg-yellow-500/10 text-yellow-500'
                                                    }`}
                                            >
                                                {project.published ? (
                                                    <>
                                                        <Eye className="h-3 w-3" /> Published
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff className="h-3 w-3" /> Draft
                                                    </>
                                                )}
                                            </span>
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/admin/projects/${project.id}`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </FadeIn>
            </Container>
        </main>
    )
}
