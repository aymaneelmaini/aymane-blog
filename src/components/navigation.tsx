'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navLinks = [
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/#experience', label: 'Experience' },
    { href: '/#contact', label: 'Contact' },
]

export function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    return (
        <header
            className={cn(
                'fixed top-0 z-50 w-full transition-all duration-200',
                isScrolled
                    ? 'border-b border-border bg-background/80 backdrop-blur-lg'
                    : 'bg-transparent'
            )}
        >
            <Container>
                <nav className="flex h-16 items-center justify-between">
                    <Link
                        href="/"
                        className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-70"
                    >
                        aymane.
                    </Link>

                    <div className="hidden items-center gap-1 md:flex">
                        {navLinks.map((link) => {
                            const isActive =
                                link.href === pathname ||
                                (link.href.startsWith('/#') && pathname === '/')

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'rounded-lg px-4 py-2 text-sm transition-colors',
                                        isActive
                                            ? 'text-foreground'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                        <div className="ml-2">
                            <ThemeToggle />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-4 w-4" />
                            ) : (
                                <Menu className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </nav>

                {isMobileMenuOpen && (
                    <div className="border-t border-border pb-4 md:hidden">
                        <div className="flex flex-col gap-1 pt-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="rounded-lg px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </Container>
        </header>
    )
}
