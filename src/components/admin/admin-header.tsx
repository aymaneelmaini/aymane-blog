'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import Link from 'next/link'

interface AdminHeaderProps {
    email: string
}

export function AdminHeader({ email }: AdminHeaderProps) {
    const router = useRouter()

    const handleSignOut = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/admin/login')
        router.refresh()
    }

    return (
        <div className="mb-12 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="mt-1 text-muted-foreground">Welcome back, {email}</p>
            </div>
            <div className="flex items-center gap-4">
                <Link
                    href="/"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    View Site
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                </Button>
            </div>
        </div>
    )
}
