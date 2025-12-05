import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST() {
    const session = await verifySession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const timestamp = Math.round(new Date().getTime() / 1000)

        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder: 'portfolio',
            },
            process.env.CLOUDINARY_API_SECRET!
        )

        return NextResponse.json({
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
        })
    } catch (error) {
        console.error('Signature error:', error)
        return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 })
    }
}
