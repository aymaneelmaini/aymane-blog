import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
    slug: string
    title: string
    excerpt: string
    publishedAt: Date
    coverUrl: string | null
    readingTime: number
    published: boolean
    tags: string[]
    content: string
}

function getAllMarkdownFiles() {
    if (!fs.existsSync(postsDirectory)) {
        return []
    }
    return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.md'))
}

export function getAllPosts(): BlogPost[] {
    const files = getAllMarkdownFiles()

    const posts = files.map((filename) => {
        const slug = filename.replace(/\.md$/, '')
        const fullPath = path.join(postsDirectory, filename)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        return {
            slug,
            title: data.title,
            excerpt: data.excerpt,
            publishedAt: new Date(data.publishedAt),
            coverUrl: data.coverUrl || null,
            readingTime: data.readingTime,
            published: data.published ?? true,
            tags: data.tags || [],
            content,
        }
    })

    return posts
        .filter((post) => post.published)
        .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}

export function getPostBySlug(slug: string): BlogPost | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.md`)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        return {
            slug,
            title: data.title,
            excerpt: data.excerpt,
            publishedAt: new Date(data.publishedAt),
            coverUrl: data.coverUrl || null,
            readingTime: data.readingTime,
            published: data.published ?? true,
            tags: data.tags || [],
            content,
        }
    } catch (error) {
        return null
    }
}

export function getAllPostSlugs(): string[] {
    const files = getAllMarkdownFiles()
    return files.map((filename) => filename.replace(/\.md$/, ''))
}
