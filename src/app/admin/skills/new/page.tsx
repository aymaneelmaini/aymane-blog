import { requireAuth } from '@/lib/auth'
import { Container } from '@/components/ui/container'
import { SkillForm } from '@/components/admin/skill-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NewSkillPage() {
    await requireAuth()

    return (
        <main className="min-h-screen py-12">
            <Container>
                <div className="mx-auto max-w-lg">
                    <Link
                        href="/admin/skills"
                        className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Skills
                    </Link>

                    <h1 className="mb-8 text-3xl font-bold">Add Skill</h1>

                    <div className="rounded-xl border border-border bg-card p-6">
                        <SkillForm />
                    </div>
                </div>
            </Container>
        </main>
    )
}
