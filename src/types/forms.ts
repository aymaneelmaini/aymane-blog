export interface ProjectFormProps {
    project?: {
        id: string
        title: string
        slug: string
        description: string
        thumbnailUrl: string | null
        liveUrl: string | null
        githubUrl: string | null
        featured: boolean
        published: boolean
        order: number
        techStack: { tech: { id: string; name: string } }[]
    }
    allTechs: { id: string; name: string }[]
}

export interface PostFormProps {
    post?: {
        id: string
        title: string
        slug: string
        excerpt: string
        content: string
        coverUrl: string | null
        readingTime: number
        published: boolean
        publishedAt: Date | null
        tags: { tag: { id: string; name: string } }[]
    }
    allTags: { id: string; name: string }[]
}

export interface ExperienceFormProps {
    experience?: {
        id: string
        company: string
        role: string
        description: string | null
        logoUrl: string | null
        startDate: Date
        endDate: Date | null
        current: boolean
        order: number
    }
}
