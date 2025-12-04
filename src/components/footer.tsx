import { Container } from '@/components/ui/container'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-border py-8">
            <Container>
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-sm text-muted-foreground">
                        © {currentYear}{' '}
                        <span className="font-medium text-foreground">Aymane El Maini</span>
                        . All rights reserved.
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        Built with
                        <span className="inline-block animate-pulse text-red-500">❤</span>
                        using Next.js & Tailwind
                    </p>
                </div>
            </Container>
        </footer>
    )
}
