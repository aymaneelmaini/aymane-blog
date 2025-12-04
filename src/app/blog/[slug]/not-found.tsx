import { Container } from '@/components/ui/container'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/ui/motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
    return (
        <>
            <Navigation />
            <main className="flex min-h-screen items-center pt-16">
                <Container>
                    <FadeIn>
                        <div className="mx-auto max-w-md text-center">
                            <h1 className="text-6xl font-bold text-muted-foreground/20">404</h1>
                            <h2 className="mt-4 text-2xl font-semibold">Post not found</h2>
                            <p className="mt-2 text-muted-foreground">
                                The blog post you're looking for doesn't exist or has been removed.
                            </p>
                            <Button className="mt-8" asChild>
                                <Link href="/blog">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Blog
                                </Link>
                            </Button>
                        </div>
                    </FadeIn>
                </Container>
            </main>
            <Footer />
        </>
    )
}
