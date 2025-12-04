import { requireAuth } from '@/lib/auth'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit } from 'lucide-react'

async function getSkills() {
    return db.skill.findMany({
        orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    })
}

export default async function AdminSkillsPage() {
    await requireAuth()
    const skills = await getSkills()

    // Group skills by category
    const skillsByCategory = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = []
        }
        acc[skill.category].push(skill)
        return acc
    }, {} as Record<string, typeof skills>)

    const categories = Object.keys(skillsByCategory)

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
                        <div>
                            <h1 className="text-3xl font-bold">Skills</h1>
                            <p className="mt-1 text-muted-foreground">
                                {skills.length} skills across {categories.length} categories
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/admin/skills/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Skill
                            </Link>
                        </Button>
                    </div>
                </div>

                {skills.length === 0 ? (
                    <div className="rounded-xl border border-border bg-card p-12 text-center">
                        <p className="text-muted-foreground">No skills yet.</p>
                        <Button className="mt-4" asChild>
                            <Link href="/admin/skills/new">Add your first skill</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {categories.map((category) => (
                            <div key={category} className="rounded-xl border border-border bg-card">
                                <div className="border-b border-dashed border-border px-4 py-3">
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                        {category}
                                    </h2>
                                </div>
                                <div className="divide-y divide-border">
                                    {skillsByCategory[category].map((skill) => (
                                        <Link
                                            key={skill.id}
                                            href={`/admin/skills/${skill.id}`}
                                            className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-sm font-medium text-muted-foreground">
                                                    {skill.name.charAt(0)}
                                                </div>
                                                <span className="font-medium">{skill.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-muted-foreground">
                                                    Order: {skill.order}
                                                </span>
                                                <Edit className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </main>
    )
}
