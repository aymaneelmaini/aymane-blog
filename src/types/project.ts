export interface ProjectCardProps {
    title: string
    description: string
    longDescription?: string
    slug: string
    thumbnailUrl?: string | null
    liveUrl?: string | null
    githubUrl?: string | null
    techStack: { name: string }[]
    featured?: boolean
}

export interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    topics: string[];
    fork: boolean;
    archived: boolean;
    updated_at: string;
}

