import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import experienceData from '@/data/experience.json'
import content from '@/data/content.json'
import Image from 'next/image'

export function ExperienceSection() {
    const sortedExperiences = [...experienceData.experiences].sort((a, b) => {
        if (a.current !== b.current) return b.current ? 1 : -1
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })

    if (sortedExperiences.length === 0) {
        return null
    }

    const formatDate = (dateStr: string) => {
        const [year, month] = dateStr.split('-')
        const date = new Date(parseInt(year), parseInt(month) - 1)
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            year: 'numeric',
        }).format(date)
    }

    return (
        <section id="experience" className="border-t border-dashed border-border py-24 sm:py-32">
            <Container>
                <SectionHeader
                    title={content.sections.experience.title}
                    description={content.sections.experience.description}
                />

                <div className="relative">
                    <div className="absolute left-0 top-0 hidden h-full w-px border-l border-dashed border-border sm:left-[7px] sm:block" />

                    <div className="space-y-8">
                        {sortedExperiences.map((exp) => (
                            <div key={exp.id} className="relative pl-0 sm:pl-12">
                                <div className="absolute left-0 top-6 hidden h-4 w-4 items-center justify-center sm:flex">
                                    <div
                                        className={`h-3 w-3 rounded-full border-2 ${exp.current
                                                ? 'border-accent bg-accent'
                                                : 'border-border bg-background'
                                            }`}
                                    />
                                </div>

                                <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/20">
                                    <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                        <div className="flex items-start gap-4">
                                            {exp.logoUrl && (
                                                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-background">
                                                    <Image
                                                        src={exp.logoUrl}
                                                        alt={`${exp.company} logo`}
                                                        fill
                                                        className="object-contain p-1.5"
                                                        unoptimized
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-lg font-semibold">{exp.role}</h3>
                                                <p className="text-muted-foreground">{exp.company}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 sm:shrink-0">
                                            {exp.current && (
                                                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                                                    Current
                                                </span>
                                            )}
                                            <span className="text-sm text-muted-foreground">
                                                {formatDate(exp.startDate)} —{' '}
                                                {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                                            </span>
                                        </div>
                                    </div>

                                    {exp.description && (
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}
