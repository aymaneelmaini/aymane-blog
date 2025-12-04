import { requireAuth } from '@/lib/auth'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import Link from 'next/link'
import {
    FileText,
    FolderKanban,
    Briefcase,
    Wrench,
    Plus,
    Eye,
    EyeOff,
    Clock,
    TrendingUp,
    Calendar,
    ArrowUpRight,
} from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'

async function getDashboardData() {
    const [
        projectsCount,
        publishedProjects,
        postsCount,
        publishedPosts,
        experiencesCount,
        skillsCount,
        recentProjects,
        recentPosts,
        recentExperiences,
    ] = await Promise.all([
        db.project.count(),
        db.project.count({ where: { published: true } }),
        db.post.count(),
        db.post.count({ where: { published: true } }),
        db.experience.count(),
        db.skill.count(),
        db.project.findMany({
            take: 3,
            orderBy: { updatedAt: 'desc' },
            select: { id: true, title: true, published: true, updatedAt: true },
        }),
        db.post.findMany({
            take: 3,
            orderBy: { updatedAt: 'desc' },
            select: { id: true, title: true, published: true, updatedAt: true, readingTime: true },
        }),
        db.experience.findMany({
            take: 3,
            orderBy: { updatedAt: 'desc' },
            select: { id: true, company: true, role: true, current: true, updatedAt: true },
        }),
    ])

    return {
        stats: {
            projects: { total: projectsCount, published: publishedProjects },
            posts: { total: postsCount, published: publishedPosts },
            experiences: experiencesCount,
            skills: skillsCount,
        },
        recent: {
            projects: recentProjects,
            posts: recentPosts,
            experiences: recentExperiences,
        },
    }
}

function formatTimeAgo(date: Date) {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(date))
}

export default async function AdminDashboard() {
    const session = await requireAuth()
    const { stats, recent } = await getDashboardData()

    const statCards = [
        {
            title: 'Projects',
            total: stats.projects.total,
            published: stats.projects.published,
            href: '/admin/projects',
            icon: FolderKanban,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
        },
        {
            title: 'Blog Posts',
            total: stats.posts.total,
            published: stats.posts.published,
            href: '/admin/posts',
            icon: FileText,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
        },
        {
            title: 'Experiences',
            total: stats.experiences,
            href: '/admin/experiences',
            icon: Briefcase,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
        },
        {
            title: 'Skills',
            total: stats.skills,
            href: '/admin/skills',
            icon: Wrench,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
        },
    ]

    return (
        <main className="min-h-screen py-12">
            <Container>
                <AdminHeader email={session.user.email} />

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((card) => (
                        <Link
                            key={card.title}
                            href={card.href}
                            className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-foreground/20 hover:shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div className={`rounded-lg ${card.bg} p-2.5`}>
                                    <card.icon className={`h-5 w-5 ${card.color}`} />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                            <div className="mt-4">
                                <span className="text-3xl font-bold">{card.total}</span>
                                {'published' in card && (
                                    <span className="ml-2 text-sm text-muted-foreground">
                                        ({card.published} published)
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{card.title}</p>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 rounded-xl border border-border bg-card p-6">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Quick Actions
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild size="sm">
                            <Link href="/admin/projects/new">
                                <Plus className="mr-2 h-4 w-4" />
                                New Project
                            </Link>
                        </Button>
                        <Button asChild size="sm" variant="secondary">
                            <Link href="/admin/posts/new">
                                <Plus className="mr-2 h-4 w-4" />
                                New Post
                            </Link>
                        </Button>
                        <Button asChild size="sm" variant="secondary">
                            <Link href="/admin/experiences/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Experience
                            </Link>
                        </Button>
                        <Button asChild size="sm" variant="secondary">
                            <Link href="/admin/skills/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Skill
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Recent Activity Grid */}
                <div className="mt-8 grid gap-6 lg:grid-cols-3">
                    {/* Recent Projects */}
                    <div className="rounded-xl border border-border bg-card">
                        <div className="flex items-center justify-between border-b border-dashed border-border px-5 py-4">
                            <h2 className="font-semibold">Recent Projects</h2>
                            <Link
                                href="/admin/projects"
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                View all
                            </Link>
                        </div>
                        {recent.projects.length === 0 ? (
                            <div className="p-5 text-center text-sm text-muted-foreground">
                                No projects yet
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {recent.projects.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/admin/projects/${project.id}`}
                                        className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">{project.title}</p>
                                            <p className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {formatTimeAgo(project.updatedAt)}
                                            </p>
                                        </div>
                                        {project.published ? (
                                            <Eye className="h-4 w-4 flex-shrink-0 text-green-500" />
                                        ) : (
                                            <EyeOff className="h-4 w-4 flex-shrink-0 text-yellow-500" />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        )}
                        <div className="border-t border-dashed border-border p-3">
                            <Button asChild variant="ghost" size="sm" className="w-full">
                                <Link href="/admin/projects/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Project
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Recent Posts */}
                    <div className="rounded-xl border border-border bg-card">
                        <div className="flex items-center justify-between border-b border-dashed border-border px-5 py-4">
                            <h2 className="font-semibold">Recent Posts</h2>
                            <Link
                                href="/admin/posts"
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                View all
                            </Link>
                        </div>
                        {recent.posts.length === 0 ? (
                            <div className="p-5 text-center text-sm text-muted-foreground">
                                No posts yet
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {recent.posts.map((post) => (
                                    <Link
                                        key={post.id}
                                        href={`/admin/posts/${post.id}`}
                                        className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">{post.title}</p>
                                            <p className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {formatTimeAgo(post.updatedAt)}
                                                <span>·</span>
                                                <span>{post.readingTime} min read</span>
                                            </p>
                                        </div>
                                        {post.published ? (
                                            <Eye className="h-4 w-4 flex-shrink-0 text-green-500" />
                                        ) : (
                                            <EyeOff className="h-4 w-4 flex-shrink-0 text-yellow-500" />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        )}
                        <div className="border-t border-dashed border-border p-3">
                            <Button asChild variant="ghost" size="sm" className="w-full">
                                <Link href="/admin/posts/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Post
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Recent Experiences */}
                    <div className="rounded-xl border border-border bg-card">
                        <div className="flex items-center justify-between border-b border-dashed border-border px-5 py-4">
                            <h2 className="font-semibold">Recent Experiences</h2>
                            <Link
                                href="/admin/experiences"
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                View all
                            </Link>
                        </div>
                        {recent.experiences.length === 0 ? (
                            <div className="p-5 text-center text-sm text-muted-foreground">
                                No experiences yet
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {recent.experiences.map((exp) => (
                                    <Link
                                        key={exp.id}
                                        href={`/admin/experiences/${exp.id}`}
                                        className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">{exp.role}</p>
                                            <p className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Briefcase className="h-3 w-3" />
                                                {exp.company}
                                            </p>
                                        </div>
                                        {exp.current && (
                                            <span className="flex-shrink-0 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                                                Current
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        )}
                        <div className="border-t border-dashed border-border p-3">
                            <Button asChild variant="ghost" size="sm" className="w-full">
                                <Link href="/admin/experiences/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Experience
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Site Links */}
                <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-6">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        View Site
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/"
                            target="_blank"
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-foreground/20"
                        >
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            Homepage
                        </Link>
                        <Link
                            href="/projects"
                            target="_blank"
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-foreground/20"
                        >
                            <FolderKanban className="h-4 w-4 text-muted-foreground" />
                            Projects
                        </Link>
                        <Link
                            href="/blog"
                            target="_blank"
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-foreground/20"
                        >
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            Blog
                        </Link>
                    </div>
                </div>
            </Container>
        </main>
    )
}
