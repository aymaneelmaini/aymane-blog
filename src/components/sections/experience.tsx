import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { db } from '@/lib/db'

async function getExperiences() {
    return db.experience.findMany({
        orderBy: [{ current: 'desc' }, { startDate: 'desc' }],
    })
}

export async function ExperienceSection() {
    const experiences = await getExperiences()

    const displayExperiences =
        experiences.length > 0
            ? experiences
            : [
                {
                    id: '1',
                    company: 'ProgressSoft Corporation',
                    role: 'Associate Software Engineer',
                    description:
                        'Develop and maintain backend APIs and microservices for global payment processing platform. Build scalable financial services using Java, Kotlin, and Spring Boot with Domain-Driven Design.',
                    startDate: new Date('2024-12-01'),
                    endDate: null,
                    current: true,
                },
                {
                    id: '2',
                    company: 'Foodeals',
                    role: 'Full Stack Developer Intern',
                    description:
                        'Developed full-stack applications using Spring Boot for backend and Angular for frontend. Implemented RESTful APIs and responsive user interfaces.',
                    startDate: new Date('2024-05-01'),
                    endDate: new Date('2024-07-01'),
                    current: false,
                },
                {
                    id: '3',
                    company: 'ICF Communication',
                    role: 'Front-end Developer Intern',
                    description:
                        'Built responsive web applications using HTML5, JavaScript, CSS3, and Tailwind CSS framework with focus on user experience.',
                    startDate: new Date('2023-04-01'),
                    endDate: new Date('2023-06-01'),
                    current: false,
                },
            ]

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            year: 'numeric',
        }).format(new Date(date))
    }

    return (
        <section id="experience" className="border-t border-dashed border-border py-24 sm:py-32">
            <Container>
                <SectionHeader
                    title="Experience"
                    description="My professional journey in software engineering."
                />

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-0 top-0 hidden h-full w-px border-l border-dashed border-border sm:left-[7px] sm:block" />

                    <div className="space-y-8">
                        {displayExperiences.map((exp) => (
                            <div key={exp.id} className="relative pl-0 sm:pl-12">
                                {/* Timeline dot */}
                                <div className="absolute left-0 top-6 hidden h-4 w-4 items-center justify-center sm:flex">
                                    <div
                                        className={`h-3 w-3 rounded-full border-2 ${exp.current
                                                ? 'border-accent bg-accent'
                                                : 'border-border bg-background'
                                            }`}
                                    />
                                </div>

                                <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/20">
                                    {/* Header */}
                                    <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                        <div>
                                            <h3 className="text-lg font-semibold">{exp.role}</h3>
                                            <p className="text-muted-foreground">{exp.company}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
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

                                    {/* Description */}
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
