'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ui/image-upload'
import { Loader2, Trash2 } from 'lucide-react'

interface ProjectFormProps {
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

export function ProjectForm({ project, allTechs }: ProjectFormProps) {
    const router = useRouter()
    const isEditing = !!project

    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        title: project?.title || '',
        slug: project?.slug || '',
        description: project?.description || '',
        thumbnailUrl: project?.thumbnailUrl || '',
        liveUrl: project?.liveUrl || '',
        githubUrl: project?.githubUrl || '',
        featured: project?.featured || false,
        published: project?.published || false,
        order: project?.order || 0,
        techIds: project?.techStack.map((t) => t.tech.id) || [],
    })

    const [newTech, setNewTech] = useState('')

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const url = isEditing ? `/api/projects/${project.id}` : '/api/projects'
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

            router.push('/admin/projects')
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this project?')) return

        setDeleting(true)
        try {
            const response = await fetch(`/api/projects/${project?.id}`, {
                method: 'DELETE',
            })

            if (!response.ok) throw new Error('Failed to delete')

            router.push('/admin/projects')
            router.refresh()
        } catch (err) {
            setError('Failed to delete project')
            setDeleting(false)
        }
    }

    const handleAddTech = async () => {
        if (!newTech.trim()) return

        try {
            const response = await fetch('/api/techs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newTech.trim() }),
            })

            if (response.ok) {
                const tech = await response.json()
                setFormData((prev) => ({
                    ...prev,
                    techIds: [...prev.techIds, tech.id],
                }))
                setNewTech('')
                router.refresh()
            }
        } catch (err) {
            console.error('Failed to add tech:', err)
        }
    }

    const toggleTech = (techId: string) => {
        setFormData((prev) => ({
            ...prev,
            techIds: prev.techIds.includes(techId)
                ? prev.techIds.filter((id) => id !== techId)
                : [...prev.techIds, techId],
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
                        placeholder="My Awesome Project"
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
                        placeholder="my-awesome-project"
                        required
                    />
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="h-32 w-full resize-none rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                    placeholder="A brief description of your project..."
                    required
                />
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Project Thumbnail</label>
                <ImageUpload
                    value={formData.thumbnailUrl}
                    onChange={(url) => setFormData((prev) => ({ ...prev, thumbnailUrl: url }))}
                    placeholder="Upload project thumbnail"
                />
            </div>

            {/* URLs */}
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="liveUrl" className="text-sm font-medium">
                        Live URL
                    </label>
                    <input
                        id="liveUrl"
                        type="url"
                        value={formData.liveUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, liveUrl: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                        placeholder="https://..."
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="githubUrl" className="text-sm font-medium">
                        GitHub URL
                    </label>
                    <input
                        id="githubUrl"
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                        placeholder="https://github.com/..."
                    />
                </div>
            </div>

            {/* Tech Stack */}
            <div className="space-y-4">
                <label className="text-sm font-medium">Tech Stack</label>

                <div className="flex flex-wrap gap-2">
                    {allTechs.map((tech) => (
                        <button
                            key={tech.id}
                            type="button"
                            onClick={() => toggleTech(tech.id)}
                            className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${formData.techIds.includes(tech.id)
                                ? 'border-accent bg-accent/10 text-accent'
                                : 'border-border hover:border-foreground/20'
                                }`}
                        >
                            {tech.name}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newTech}
                        onChange={(e) => setNewTech(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                        className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm outline-none transition-colors focus:border-accent"
                        placeholder="Add new technology..."
                    />
                    <Button type="button" variant="secondary" onClick={handleAddTech}>
                        Add
                    </Button>
                </div>
            </div>

            {/* Options */}
            <div className="flex flex-wrap gap-6">
                <label className="flex cursor-pointer items-center gap-2">
                    <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                        className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <span className="text-sm">Featured project</span>
                </label>

                <label className="flex cursor-pointer items-center gap-2">
                    <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
                        className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <span className="text-sm">Published</span>
                </label>

                <div className="flex items-center gap-2">
                    <label htmlFor="order" className="text-sm">
                        Order:
                    </label>
                    <input
                        id="order"
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                        className="w-20 rounded-lg border border-border bg-card px-3 py-1.5 text-sm outline-none focus:border-accent"
                    />
                </div>
            </div>

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
                        {isEditing ? 'Update Project' : 'Create Project'}
                    </Button>
                </div>
            </div>
        </form>
    )
}
