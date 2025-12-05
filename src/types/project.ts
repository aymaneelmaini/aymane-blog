export interface ProjectCardProps {
    title: string
    description: string
    slug: string
    thumbnailUrl?: string | null
    liveUrl?: string | null
    githubUrl?: string | null
    techStack: { name: string }[]
    featured?: boolean
}
