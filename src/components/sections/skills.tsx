import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import skillsData from '@/data/skills.json'
import content from '@/data/content.json'

export function SkillsSection() {
    const formattedCategories = skillsData.skillCategories.map((cat) => ({
        title: cat.category,
        skills: cat.skills.map((s) => s.name),
    }))

    if (formattedCategories.length === 0) {
        return null
    }

    return (
        <section id="skills" className="border-t border-dashed border-border py-24 sm:py-32">
            <Container>
                <SectionHeader
                    title={content.sections.skills.title}
                    description={content.sections.skills.description}
                />

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {formattedCategories.map((category) => (
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
