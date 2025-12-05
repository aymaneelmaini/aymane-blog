'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-react'
import { ExperienceFormProps } from '@/types/forms'

export function ExperienceForm({ experience }: ExperienceFormProps) {
    const router = useRouter()
    const isEditing = !!experience

    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState('')

    const formatDateForInput = (date: Date | null) => {
        if (!date) return ''
        return new Date(date).toISOString().split('T')[0]
    }

    const [formData, setFormData] = useState({
        company: experience?.company || '',
        role: experience?.role || '',
        description: experience?.description || '',
        logoUrl: experience?.logoUrl || '',
        startDate: formatDateForInput(experience?.startDate || null),
        endDate: formatDateForInput(experience?.endDate || null),
        current: experience?.current || false,
        order: experience?.order || 0,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const url = isEditing ? `/api/experiences/${experience.id}` : '/api/experiences'
            const method = isEditing ? 'PUT' : 'POST'

            const payload = {
                ...formData,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: formData.current || !formData.endDate ? null : new Date(formData.endDate).toISOString(),
            }

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Something went wrong')
            }

            router.push('/admin/experiences')
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this experience?')) return

        setDeleting(true)
        try {
            const response = await fetch(`/api/experiences/${experience?.id}`, {
                method: 'DELETE',
            })

            if (!response.ok) throw new Error('Failed to delete')

            router.push('/admin/experiences')
            router.refresh()
        } catch (err) {
            setError('Failed to delete experience')
            setDeleting(false)
        }
    }

    const handleCurrentChange = (checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            current: checked,
            endDate: checked ? '' : prev.endDate,
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-500">
                    {error}
                </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium">
                        Company <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                        placeholder="Company Name"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium">
                        Role <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="role"
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                        placeholder="Software Engineer"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                    Description
                </label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="h-32 w-full resize-none rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                    placeholder="Describe your responsibilities and achievements..."
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="logoUrl" className="text-sm font-medium">
                    Company Logo URL
                </label>
                <input
                    id="logoUrl"
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, logoUrl: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                    placeholder="https://..."
                />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm font-medium">
                        Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="endDate" className="text-sm font-medium">
                        End Date {formData.current && <span className="text-muted-foreground">(Current)</span>}
                    </label>
                    <input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent disabled:opacity-50"
                        disabled={formData.current}
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.current}
                        onChange={(e) => handleCurrentChange(e.target.checked)}
                        className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <span className="text-sm">Current position</span>
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
                        {isEditing ? 'Update Experience' : 'Add Experience'}
                    </Button>
                </div>
            </div>
        </form>
    )
}
