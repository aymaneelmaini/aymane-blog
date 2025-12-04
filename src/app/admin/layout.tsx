import { ThemeProvider } from '@/components/theme-provider'
import { AnimatedBackground } from '@/components/ui/animated-background'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ThemeProvider>
            <AnimatedBackground />
            {children}
        </ThemeProvider>
    )
}
