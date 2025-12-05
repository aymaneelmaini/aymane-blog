export interface BlogCardProps {
    title: string
    excerpt: string
    slug: string
    publishedAt: Date | null
    readingTime: number
    tags?: { name: string }[]
    coverUrl?: string | null
}
