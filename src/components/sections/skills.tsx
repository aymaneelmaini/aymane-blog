import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'

const skillCategories = [
    {
        title: 'Languages',
        skills: ['Java', 'Kotlin', 'TypeScript', 'JavaScript', 'PHP', 'C/C++'],
    },
    {
        title: 'Backend',
        skills: ['Spring Boot', 'Spring MVC', 'JPA/Hibernate', 'JUnit 5', 'Mockito', 'Laravel'],
    },
    {
        title: 'Frontend',
        skills: ['React', 'Next.js', 'Angular', 'Tailwind CSS'],
    },
    {
        title: 'Databases',
        skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Oracle DB', 'Oracle AQ'],
    },
    {
        title: 'DevOps & Tools',
        skills: ['Docker', 'Kubernetes', 'GCP', 'GitHub Actions', 'Maven', 'Gradle'],
    },
    {
        title: 'Architecture',
        skills: ['Microservices', 'DDD', 'TDD', 'Design Patterns', 'REST APIs'],
    },
]

export function SkillsSection() {
    return (
        <section id="skills" className="border-t border-dashed border-border py-24 sm:py-32">
            <Container>
                <SectionHeader
                    title="Skills"
                    description="Technologies and tools I work with daily."
                />

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {skillCategories.map((category) => (
                        <div key={category.title} className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                {category.title}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {category.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:border-foreground/20"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}
