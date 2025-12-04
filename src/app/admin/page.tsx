import { requireAuth } from '@/lib/auth'
import { Container } from '@/components/ui/container'
import { FadeIn } from '@/components/ui/motion'
import { db } from '@/lib/db'
import Link from 'next/link'
import { FileText, FolderKanban, Briefcase } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'

async function getStats() {
    const [projects, posts, experiences] = await Promise.all([
        db.project.count(),
        db.post.count(),
        db.experience.count(),
    ])

    return { projects, posts, experiences }
}

export default async function AdminDashboard() {
    const session = await requireAuth()
    const stats = await getStats()

    const cards = [
        {
            title: 'Projects',
            count: stats.projects,
            href: '/admin/projects',
            icon: FolderKanban,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
        },
        {
            title: 'Blog Posts',
            count: stats.posts,
            href: '/admin/posts',
            icon: FileText,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
        },
        {
            title: 'Experiences',
            count: stats.experiences,
            href: '/admin/experiences',
            icon: Briefcase,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
        },
    ]

    return (
        <main className="min-h-screen py-12">
            <Container>
                {/* Header */}
                <FadeIn>
                    <AdminHeader email={session.user.email} />
                </FadeIn>

                {/* Stats Cards */}
                <FadeIn delay={0.1}>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {cards.map((card) => (
                            <Link
                                key={card.title}
                                href={card.href}
                                className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-card"
                            >
                                <div className="flex items-center justify-between">
                                    <div className={`rounded-lg ${card.bg} p-3`}>
                                        <card.icon className={`h-6 w-6 ${card.color}`} />
                                    </div>
                                    <span className="text-3xl font-bold">{card.count}</span>
                                </div>
                                <h3 className="mt-4 font-semibold transition-colors group-hover:text-accent">
                                    {card.title}
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Manage your {card.title.toLowerCase()}
                                </p>
                            </Link>
                        ))}
                    </div>
                </FadeIn>
            </Container>
        </main>
    )
}
