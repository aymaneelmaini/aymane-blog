import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                muted: 'var(--muted)',
                'muted-foreground': 'var(--muted-foreground)',
                border: 'var(--border)',
                accent: {
                    DEFAULT: 'var(--accent)',
                    foreground: 'var(--accent-foreground)',
                },
                card: {
                    DEFAULT: 'var(--card)',
                    foreground: 'var(--card-foreground)',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '8px',
                lg: '12px',
            },
            boxShadow: {
                card: '0 4px 12px rgba(0, 0, 0, 0.08)',
                'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
            },
            maxWidth: {
                content: '1200px',
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
}

export default config
