'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    placeholder?: string
}

export function ImageUpload({ value, onChange, placeholder = 'Upload an image' }: ImageUploadProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [dragActive, setDragActive] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (file: File) => {
        setLoading(true)
        setError('')

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed')
            }

            onChange(data.url)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed')
        } finally {
            setLoading(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleUpload(file)
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const file = e.dataTransfer.files?.[0]
        if (file && file.type.startsWith('image/')) {
            handleUpload(file)
        } else {
            setError('Please drop an image file')
        }
    }

    const handleRemove = () => {
        onChange('')
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    return (
        <div className="space-y-3">
            {/* Preview */}
            {value && (
                <div className="relative inline-block">
                    <div className="relative h-40 w-64 overflow-hidden rounded-lg border border-border">
                        <Image
                            src={value}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Upload Area */}
            {!value && (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${dragActive
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-foreground/20'
                        }`}
                >
                    {loading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                        </div>
                    ) : (
                        <>
                            <ImageIcon className="mb-3 h-10 w-10 text-muted-foreground/50" />
                            <p className="mb-1 text-sm font-medium">{placeholder}</p>
                            <p className="mb-4 text-xs text-muted-foreground">
                                Drag & drop or click to browse
                            </p>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => inputRef.current?.click()}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                Choose File
                            </Button>
                            <p className="mt-3 text-xs text-muted-foreground">
                                PNG, JPG, GIF, WebP up to 5MB
                            </p>
                        </>
                    )}
                </div>
            )}

            {/* Hidden Input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Error */}
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Manual URL Input */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">or paste URL:</span>
                <input
                    type="url"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm outline-none transition-colors focus:border-accent"
                    placeholder="https://..."
                />
            </div>
        </div>
    )
}
