import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Github, Linkedin, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import { socialMediaLinks } from '@/constants/social-media'

export function ContactSection() {
    return (
        <section id="contact" className="border-t border-dashed border-border py-24 sm:py-32">
            <Container>
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Let&apos;s work together
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        I&apos;m always open to discussing new opportunities, interesting
                        projects, or just having a chat about software engineering.
                    </p>

                    <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Marrakesh, Morocco</span>
                    </div>

                    <div className="mt-8">
                        <Button size="lg" asChild>
                            <Link href={socialMediaLinks.find(link => link.label === 'Mail')?.link || 'mailto:elmainiaymane03@gmail.com'}>
                                <Mail className="mr-2 h-4 w-4" />
                                Get in touch
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-4">
                        {socialMediaLinks.filter(link => link.label === 'Github' || link.label === 'Linkedin').map((link) => {
                            const Icon = link.label === 'Github' ? Github : Linkedin
                            return (
                                <Link
                                    key={link.label}
                                    href={link.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                                >
                                    <Icon className="h-4 w-4" />
                                    {link.label === 'Github' ? 'GitHub' : 'LinkedIn'}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </Container>
        </section>
    )
}
