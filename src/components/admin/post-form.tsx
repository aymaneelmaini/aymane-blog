'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ui/image-upload'
import { Loader2, Trash2 } from 'lucide-react'

interface PostFormProps {
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

export function PostForm({ post, allTags }: PostFormProps) {
    const router = useRouter()
    const isEditing = !!post

    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        title: post?.title || '',
        slug: post?.slug || '',
        excerpt: post?.excerpt || '',
        content: post?.content || '',
        coverUrl: post?.coverUrl || '',
        readingTime: post?.readingTime || 5,
        published: post?.published || false,
        tagIds: post?.tags.map((t) => t.tag.id) || [],
    })

    const [newTag, setNewTag] = useState('')

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }

    const handleTitleChange = (title: string) => {
        setFormData((prev) => ({
            ...prev,
            title,
            slug: isEditing ? prev.slug : generateSlug(title),
        }))
    }

    const calculateReadingTime = (content: string) => {
        const wordsPerMinute = 200
        const words = content.trim().split(/\s+/).length
        return Math.max(1, Math.ceil(words / wordsPerMinute))
    }

    const handleContentChange = (content: string) => {
        setFormData((prev) => ({
            ...prev,
            content,
            readingTime: calculateReadingTime(content),
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const url = isEditing ? `/api/posts/${post.id}` : '/api/posts'
            const method = isEditing ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Something went wrong')
            }

            router.push('/admin/posts')
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return

        setDeleting(true)
        try {
            const response = await fetch(`/api/posts/${post?.id}`, {
                method: 'DELETE',
            })

            if (!response.ok) throw new Error('Failed to delete')

            router.push('/admin/posts')
            router.refresh()
        } catch (err) {
            setError('Failed to delete post')
            setDeleting(false)
        }
    }

    const handleAddTag = async () => {
        if (!newTag.trim()) return

        try {
            const response = await fetch('/api/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newTag.trim() }),
            })

            if (response.ok) {
                const tag = await response.json()
                setFormData((prev) => ({
                    ...prev,
                    tagIds: [...prev.tagIds, tag.id],
                }))
                setNewTag('')
                router.refresh()
            }
        } catch (err) {
            console.error('Failed to add tag:', err)
        }
    }

    const toggleTag = (tagId: string) => {
        setFormData((prev) => ({
            ...prev,
            tagIds: prev.tagIds.includes(tagId)
                ? prev.tagIds.filter((id) => id !== tagId)
                : [...prev.tagIds, tagId],
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-500">
                    {error}
                </div>
            )}

            {/* Title & Slug */}
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                        placeholder="My Blog Post Title"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="slug" className="text-sm font-medium">
                        Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="slug"
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                        placeholder="my-blog-post-title"
                        required
                    />
                </div>
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image</label>
                <ImageUpload
                    value={formData.coverUrl}
                    onChange={(url) => setFormData((prev) => ({ ...prev, coverUrl: url }))}
                    placeholder="Upload cover image"
                />
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
                <label htmlFor="excerpt" className="text-sm font-medium">
                    Excerpt <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                    className="h-24 w-full resize-none rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                    placeholder="A brief summary of your post..."
                    required
                />
            </div>

            {/* Content */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="content" className="text-sm font-medium">
                        Content (Markdown) <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-muted-foreground">
                        ~{formData.readingTime} min read
                    </span>
                </div>
                <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    className="h-96 w-full resize-y rounded-lg border border-border bg-card px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-accent"
                    placeholder="# My Post

Write your content in Markdown..."
                    required
                />
            </div>

            {/* Tags */}
            <div className="space-y-4">
                <label className="text-sm font-medium">Tags</label>

                <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleTag(tag.id)}
                            className={`rounded-full border px-3 py-1 text-sm transition-colors ${formData.tagIds.includes(tag.id)
                                    ? 'border-accent bg-accent/10 text-accent'
                                    : 'border-border hover:border-foreground/20'
                                }`}
                        >
                            {tag.name}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm outline-none transition-colors focus:border-accent"
                        placeholder="Add new tag..."
                    />
                    <Button type="button" variant="secondary" onClick={handleAddTag}>
                        Add
                    </Button>
                </div>
            </div>

            {/* Published */}
            <label className="flex cursor-pointer items-center gap-2">
                <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                />
                <span className="text-sm">Published</span>
            </label>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-dashed border-border pt-6">
                <div>
                    {isEditing && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                        >
                            {deleting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            Delete
                        </Button>
                    )}
                </div>
                <div className="flex gap-3">
                    <Button type="button" variant="secondary" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? 'Update Post' : 'Create Post'}
                    </Button>
                </div>
            </div>
        </form>
    )
}
