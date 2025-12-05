import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const runtime = 'nodejs'
export const maxDuration = 60 // Allow up to 60 seconds

export async function POST(request: Request) {
    const session = await verifySession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
                { status: 400 }
            )
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 5MB.' },
                { status: 400 }
            )
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to Cloudinary using promise wrapper
        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: 'portfolio',
                        resource_type: 'image',
                        timeout: 60000, // 60 second timeout
                    },
                    (error, result) => {
                        if (error) {
                            reject(error)
                        } else if (result) {
                            resolve(result)
                        } else {
                            reject(new Error('No result from Cloudinary'))
                        }
                    }
                )
                .end(buffer)
        })

        return NextResponse.json({ url: result.secure_url }, { status: 201 })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }
}
