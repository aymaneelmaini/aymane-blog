import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
})

export const metadata: Metadata = {
    title: 'Aymane El Maini | Software Engineer',
    description:
        'Associate Software Engineer specializing in Java & Kotlin backend development. Building scalable financial services and payment processing systems.',
    keywords: [
        'Software Engineer',
        'Java Developer',
        'Kotlin Developer',
        'Backend Developer',
        'Spring Boot',
        'Microservices',
    ],
    authors: [{ name: 'Aymane El Maini' }],
    openGraph: {
        title: 'Aymane El Maini | Software Engineer',
        description:
            'Associate Software Engineer specializing in Java & Kotlin backend development.',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={inter.variable} suppressHydrationWarning>
            <body className="bg-background text-foreground antialiased">
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    )
}
