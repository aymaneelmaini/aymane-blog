import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { db } from '@/lib/db'

async function getSkills() {
    const skills = await db.skill.findMany({
        orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    })

    if (skills.length === 0) {
        return null
    }

    const grouped = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = []
        }
        acc[skill.category].push(skill.name)
        return acc
    }, {} as Record<string, string[]>)

    return Object.entries(grouped).map(([title, skills]) => ({
        title,
        skills,
    }))
}

export async function SkillsSection() {
    const skillCategories = await getSkills()

    if (!skillCategories) {
        return null
    }

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
