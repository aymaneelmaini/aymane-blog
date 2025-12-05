'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun, Palette } from 'lucide-react'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button className="h-9 w-9 rounded-lg border border-border bg-background" />
        )
    }

    const cycleTheme = () => {
        if (theme === 'light') {
            setTheme('dark')
        } else if (theme === 'dark') {
            setTheme('gruvbox')
        } else {
            setTheme('light')
        }
    }

    const getIcon = () => {
        if (theme === 'light') return <Sun className="h-4 w-4" />
        if (theme === 'dark') return <Moon className="h-4 w-4" />
        return <Palette className="h-4 w-4" />
    }

    return (
        <button
            onClick={cycleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-muted"
            aria-label="Toggle theme"
        >
            {getIcon()}
        </button>
    )
}
