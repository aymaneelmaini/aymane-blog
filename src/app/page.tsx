import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/sections/hero'
import { ProjectsSection } from '@/components/sections/projects'
import { BlogSection } from '@/components/sections/blog'
import { ExperienceSection } from '@/components/sections/experience'
import { SkillsSection } from '@/components/sections/skills'
import { ContactSection } from '@/components/sections/contact'
import { Footer } from '@/components/footer'

export default function Home() {
    return (
        <>
            <Navigation />
            <main>
                <HeroSection />
                <ProjectsSection />
                <BlogSection />
                <ExperienceSection />
                <SkillsSection />
                <ContactSection />
            </main>
            <Footer />
        </>
    )
}
