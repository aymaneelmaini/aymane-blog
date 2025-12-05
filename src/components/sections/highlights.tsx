import { Container } from '@/components/ui/container'

const quickStats = [
    {
        icon: '💳',
        title: 'Payment Systems Expert',
        description: 'Building SWIFT & Visa transaction processing at scale',
    },
    {
        icon: '🏗️',
        title: 'Microservices Architect',
        description: 'Designing scalable distributed systems with Spring Boot',
    },
    {
        icon: '🎯',
        title: 'Domain-Driven Design',
        description: 'Applying DDD principles to complex business domains',
    },
    {
        icon: '⚡',
        title: 'Performance Focused',
        description: 'Optimizing systems to handle millions of transactions',
    },
    {
        icon: '🔄',
        title: 'Legacy Modernization',
        description: 'Transforming legacy codebases into modern architectures',
    },
    {
        icon: '🚀',
        title: 'Full-Stack Capable',
        description: 'From Spring Boot APIs to React & Next.js frontends',
    },
]

const whatIDo = [
    {
        icon: '💰',
        title: 'Payment Processing',
        description:
            'Developing robust payment systems handling SWIFT messages, Visa transactions, and real-time financial operations with zero tolerance for errors.',
    },
    {
        icon: '🏛️',
        title: 'Enterprise Architecture',
        description:
            'Designing and implementing microservices architectures that scale, using Spring Boot, Kafka, and event-driven patterns.',
    },
    {
        icon: '🧪',
        title: 'Quality Engineering',
        description:
            'Building reliable systems with comprehensive testing strategies including TDD, integration tests, and contract testing.',
    },
    {
        icon: '🔧',
        title: 'Backend Development',
        description:
            'Crafting clean, maintainable code in Java and Kotlin with focus on SOLID principles and clean architecture.',
    },
]

export function HighlightsSection() {
    return (
        <section className="relative overflow-hidden bg-foreground py-24 text-background dark:bg-muted/30 dark:text-foreground sm:py-32">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 dark:to-black/20" />

            <Container className="relative">
                {/* Quick Stats */}
                <div className="mb-24">
                    <h2 className="mb-12 flex items-center justify-center gap-3 text-2xl font-bold sm:text-3xl">
                        <span>🎯</span>
                        <span>Quick Stats</span>
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {quickStats.map((stat) => (
                            <div
                                key={stat.title}
                                className="rounded-xl border border-background/10 bg-background/5 p-5 backdrop-blur-sm transition-colors hover:bg-background/10 dark:border-border dark:bg-card"
                            >
                                <div className="mb-2 flex items-center gap-3">
                                    <span className="text-xl">{stat.icon}</span>
                                    <h3 className="font-semibold">{stat.title}</h3>
                                </div>
                                <p className="text-sm text-background/70 dark:text-muted-foreground">
                                    {stat.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* What I Do */}
                <div>
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 flex items-center justify-center gap-3 text-2xl font-bold sm:text-3xl">
                            <span>💼</span>
                            <span>What I Do</span>
                        </h2>
                        <p className="mx-auto max-w-2xl text-background/70 dark:text-muted-foreground">
                            Associate Software Engineer specializing in Payment Processing,
                            Enterprise Java Development & Microservices Architecture
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        {whatIDo.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-xl border border-background/10 bg-background/5 p-6 backdrop-blur-sm transition-colors hover:bg-background/10 dark:border-border dark:bg-card"
                            >
                                <div className="mb-3 flex items-center gap-3">
                                    <span className="text-2xl">{item.icon}</span>
                                    <h3 className="text-lg font-semibold">{item.title}</h3>
                                </div>
                                <p className="leading-relaxed text-background/70 dark:text-muted-foreground">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}
