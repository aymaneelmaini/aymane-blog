import { requireAuth } from '@/lib/auth'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Building2 } from 'lucide-react'

async function getExperiences() {
    return db.experience.findMany({
        orderBy: [{ current: 'desc' }, { startDate: 'desc' }],
    })
}

export default async function AdminExperiencesPage() {
    await requireAuth()
    const experiences = await getExperiences()

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            year: 'numeric',
        }).format(new Date(date))
    }

    return (
        <main className="min-h-screen py-12">
            <Container>
                <div className="mb-8">
                    <Link
                        href="/admin"
                        className="mb-4 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">Experiences</h1>
                        <Button asChild>
                            <Link href="/admin/experiences/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Experience
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card">
                    {experiences.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-muted-foreground">No experiences yet.</p>
                            <Button className="mt-4" asChild>
                                <Link href="/admin/experiences/new">Add your first experience</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {experiences.map((exp) => (
                                <Link
                                    key={exp.id}
                                    href={`/admin/experiences/${exp.id}`}
                                    className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <Building2 className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{exp.role}</h3>
                                            <p className="text-sm text-muted-foreground">{exp.company}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="flex items-center gap-2">
                                                {exp.current && (
                                                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                                            </p>
                                        </div>
                                        <Edit className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </main>
    )
}
