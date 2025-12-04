import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
    return (
        <section className="relative flex min-h-screen items-center pt-16">
            <Container>
                <div className="flex flex-col items-start gap-8">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2 rounded-full border border-dashed border-border px-4 py-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                        </span>
                        <span className="text-sm text-muted-foreground">
                            Available for opportunities
                        </span>
                    </div>

                    {/* Main Heading */}
                    <div className="max-w-3xl space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            Hi, I&apos;m Aymane
                            <span className="text-muted-foreground">.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground sm:text-2xl md:text-3xl">
                            Software Engineer building{' '}
                            <span className="text-foreground">scalable backend systems</span>{' '}
                            for financial services.
                        </p>
                    </div>

                    {/* Description */}
                    <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                        Associate Software Engineer at ProgressSoft, specializing in Java & Kotlin.
                        I build microservices and payment processing platforms handling SWIFT
                        integrations and Visa transactions.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center gap-4">
                        <Button size="lg" asChild>
                            <Link href="/projects">View Projects</Link>
                        </Button>
                        <Button variant="secondary" size="lg" asChild>
                            <Link href="/blog">Read Blog</Link>
                        </Button>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-1 pt-4">
                        <Link
                            href="https://github.com/aymaneelmaini"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="GitHub"
                        >
                            <Github className="h-5 w-5" />
                        </Link>
                        <Link
                            href="https://linkedin.com/in/aymaneelmaini"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="h-5 w-5" />
                        </Link>
                        <Link
                            href="mailto:elmainiaymane03@gmail.com"
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="Email"
                        >
                            <Mail className="h-5 w-5" />
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                    <Link
                        href="#projects"
                        className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <span className="text-xs uppercase tracking-widest">Scroll</span>
                        <ArrowDown className="h-4 w-4 animate-bounce" />
                    </Link>
                </div>
            </Container>
        </section>
    )
}
