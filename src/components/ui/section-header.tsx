interface SectionHeaderProps {
    title: string
    description?: string
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
    return (
        <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
            {description && (
                <p className="mt-4 text-lg text-muted-foreground">{description}</p>
            )}
        </div>
    )
}
