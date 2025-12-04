'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-react'

const CATEGORIES = [
    'Languages',
    'Backend',
    'Frontend',
    'Databases',
    'DevOps & Tools',
    'Architecture',
]

interface SkillFormProps {
    skill?: {
        id: string
        name: string
        category: string
        iconUrl: string | null
        order: number
    }
}

export function SkillForm({ skill }: SkillFormProps) {
    const router = useRouter()
    const isEditing = !!skill

    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        name: skill?.name || '',
        category: skill?.category || CATEGORIES[0],
        iconUrl: skill?.iconUrl || '',
        order: skill?.order || 0,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const url = isEditing ? `/api/skills/${skill.id}` : '/api/skills'
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

            router.push('/admin/skills')
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this skill?')) return

        setDeleting(true)
        try {
            const response = await fetch(`/api/skills/${skill?.id}`, {
                method: 'DELETE',
            })

            if (!response.ok) throw new Error('Failed to delete')

            router.push('/admin/skills')
            router.refresh()
        } catch (err) {
            setError('Failed to delete skill')
            setDeleting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-500">
                    {error}
                </div>
            )}

            {/* Name */}
            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                    Skill Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                    placeholder="e.g., TypeScript, Docker, React"
                    required
                />
            </div>

            {/* Category */}
            <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                    Category <span className="text-red-500">*</span>
                </label>
                <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                    required
                >
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Icon URL */}
            <div className="space-y-2">
                <label htmlFor="iconUrl" className="text-sm font-medium">
                    Icon URL <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                    id="iconUrl"
                    type="url"
                    value={formData.iconUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, iconUrl: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                    placeholder="https://..."
                />
                <p className="text-xs text-muted-foreground">
                    Use icons from devicon.dev or similar
                </p>
            </div>

            {/* Order */}
            <div className="space-y-2">
                <label htmlFor="order" className="text-sm font-medium">
                    Display Order
                </label>
                <input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    className="w-32 rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                />
                <p className="text-xs text-muted-foreground">
                    Lower numbers appear first
                </p>
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
                        {isEditing ? 'Update Skill' : 'Add Skill'}
                    </Button>
                </div>
            </div>
        </form>
    )
}
