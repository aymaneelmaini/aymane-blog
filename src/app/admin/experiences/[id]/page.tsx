import { requireAuth } from '@/lib/auth'
import { Container } from '@/components/ui/container'
import { ExperienceForm } from '@/components/admin/experience-form'
import { db } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{ id: string }>
}

async function getExperience(id: string) {
    return db.experience.findUnique({
        where: { id },
    })
}

export default async function EditExperiencePage({ params }: PageProps) {
    await requireAuth()
    const { id } = await params

    const experience = await getExperience(id)

    if (!experience) {
        notFound()
    }

    return (
        <main className="min-h-screen py-12">
            <Container>
                <div className="mx-auto max-w-2xl">
                    <Link
                        href="/admin/experiences"
                        className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Experiences
                    </Link>

                    <h1 className="mb-8 text-3xl font-bold">Edit Experience</h1>

                    <div className="rounded-xl border border-border bg-card p-6">
                        <ExperienceForm experience={experience} />
                    </div>
                </div>
            </Container>
        </main>
    )
}
