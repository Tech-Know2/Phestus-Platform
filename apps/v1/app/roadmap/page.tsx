type RoadmapStatus = 'completed' | 'in-progress' | 'planned'

type RoadmapItem = {
    title: string
    description: string
    timeline: string
    status: RoadmapStatus
    category?: string
}

type RoadmapPhase = {
    title: string
    description?: string
    items: RoadmapItem[]
}

export const roadmapData: RoadmapPhase[] = [
    {
        title: 'Foundation',
        description: 'Establish the core runtime and architecture that powers the Phestus ecosystem.',
        items: [
            {
                title: 'Core Runtime',
                description: 'Establish the Phestus runtime, context, registries, lifecycle, and dependency system.',
                timeline: 'Completed',
                status: 'completed',
                category: 'Core',
            },
            {
                title: 'Module System',
                description: 'Create the capability-based module architecture used throughout the platform.',
                timeline: 'Completed',
                status: 'completed',
                category: 'Modules',
            },
            {
                title: 'Provider System',
                description: 'Introduce provider abstractions that allow modules to remain independent from implementations.',
                timeline: 'Completed',
                status: 'completed',
                category: 'Providers',
            },
            {
                title: 'Plugin System',
                description: 'Add installable plugins for bundling modules, providers, configuration, and ecosystem capabilities.',
                timeline: 'Completed',
                status: 'completed',
                category: 'Plugins',
            },
        ],
    },
    {
        title: 'Platform',
        description: 'Build the services and infrastructure needed for production applications.',
        items: [
            {
                title: 'Event System',
                description: 'Provide a unified event bus for communication between modules and services.',
                timeline: 'Completed',
                status: 'completed',
                category: 'Events',
            },
            {
                title: 'Queue & Job System',
                description: 'Introduce queues and jobs for asynchronous and background processing.',
                timeline: 'Completed',
                status: 'completed',
                category: 'Jobs',
            },
            {
                title: 'Workflow Engine',
                description: 'Create composable workflows that connect events, jobs, queues, and application capabilities.',
                timeline: 'Completed',
                status: 'completed',
                category: 'Workflows',
            },
            {
                title: 'Worker System',
                description: 'Allow dedicated workers to register capabilities and execute platform workloads.',
                timeline: 'In progress',
                status: 'in-progress',
                category: 'Workers',
            },
        ],
    },
    {
        title: 'Application Services',
        description: 'Expand Phestus into a complete application platform.',
        items: [
            {
                title: 'Service Abstraction',
                description: 'Create a backend-neutral service layer for data, schema, and application operations.',
                timeline: 'Q4 2026',
                status: 'planned',
                category: 'Services',
            },
            {
                title: 'API Module',
                description: 'Provide a modular server API system for defining routes, middleware, and request handling.',
                timeline: 'Completed',
                status: 'completed',
                category: 'API',
            },
            {
                title: 'API Client',
                description: 'Create a typed client for interacting with Phestus server APIs from applications.',
                timeline: 'Completed',
                status: 'completed',
                category: 'API',
            },
            {
                title: 'Authentication & Middleware',
                description: 'Provide reusable authentication and role-based access control capabilities.',
                timeline: 'Completed',
                status: 'completed',
                category: 'Security',
            },
        ],
    },
    {
        title: 'Ecosystem',
        description: 'Make Phestus extensible and accessible through a growing package ecosystem.',
        items: [
            {
                title: 'Phestus Package Registry',
                description: 'Provide a private package registry for distributing Phestus modules, providers, and plugins.',
                timeline: 'Q2 2027',
                status: 'planned',
                category: 'Ecosystem',
            },
            {
                title: 'Phestus CLI',
                description: 'Create a CLI for authentication, package installation, project configuration, and development workflows.',
                timeline: 'Q1 2027',
                status: 'planned',
                category: 'Tooling',
            },
            {
                title: 'Marketplace',
                description: 'Allow developers to discover, purchase, and install packages from the Phestus ecosystem.',
                timeline: 'Q3 2027',
                status: 'planned',
                category: 'Marketplace',
            },
        ],
    },
]

const statusConfig: Record<
    RoadmapStatus,
    {
        label: string
        dot: string
        badge: string
    }
> = {
    completed: {
        label: 'Completed',
        dot: 'bg-[var(--color-success-500)]',
        badge: 'bg-[var(--color-success-50)] text-[var(--color-success-700)] border-[var(--color-success-200)]',
    },
    'in-progress': {
        label: 'In progress',
        dot: 'bg-[var(--color-warning-500)]',
        badge: 'bg-[var(--color-warning-50)] text-[var(--color-warning-700)] border-[var(--color-warning-200)]',
    },
    planned: {
        label: 'Planned',
        dot: 'bg-[var(--theme-accent-500)]',
        badge: 'bg-[var(--theme-accent-50)] text-[var(--theme-accent-700)] border-[var(--theme-accent-200)]',
    },
}

function RoadmapItemCard({ item }: { item: RoadmapItem }) {
    const status = statusConfig[item.status]

    return (
        <div className="relative pl-10">
            {/* Timeline node */}
            <div
                className={`absolute left-0 top-6 z-10 flex h-3 w-3 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[var(--theme-elevation-0)] ${status.dot}`}
            />

            <div className="rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-0)] p-5 shadow-[0_1px_2px_rgba(15,35,65,0.04)] transition-colors hover:border-[var(--theme-elevation-250)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold tracking-[-0.015em] text-[var(--theme-elevation-800)]">
                                {item.title}
                            </h3>

                            {item.category && (
                                <span className="rounded-[var(--style-radius-s)] bg-[var(--theme-elevation-50)] px-2 py-0.5 text-[11px] font-medium text-[var(--theme-elevation-600)]">
                                    {item.category}
                                </span>
                            )}
                        </div>

                        <p className="max-w-2xl text-sm leading-6 text-[var(--theme-elevation-600)]">
                            {item.description}
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-row items-center gap-2 sm:flex-col sm:items-end">
                        <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${status.badge}`}
                        >
                            {status.label}
                        </span>

                        <span className="text-xs font-medium text-[var(--theme-elevation-500)]">
                            {item.timeline}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Roadmap() {
    return (
        <main className="min-h-screen bg-[var(--theme-elevation-0)]">
            <section className="mx-auto max-w-5xl px-6 pb-24 pt-20 lg:px-8 lg:pt-28">
                {/* Header */}
                <div className="max-w-2xl">
                    <div className="mb-5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--theme-accent-600)]">
                        Roadmap
                    </div>

                    <h1 className="text-4xl font-semibold tracking-[-0.035em] text-[var(--theme-elevation-900)] sm:text-5xl">
                        Building the future of Phestus.
                    </h1>

                    <p className="mt-5 text-base leading-7 text-[var(--theme-elevation-600)] sm:text-lg">
                        A look at what we have built, what we are working on, and
                        what is planned for the Phestus platform and ecosystem.
                    </p>
                </div>

                {/* Status legend */}
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-[var(--theme-elevation-150)] py-4">
                    {(Object.keys(statusConfig) as RoadmapStatus[]).map((status) => (
                        <div
                            key={status}
                            className="flex items-center gap-2 text-xs font-medium text-[var(--theme-elevation-600)]"
                        >
                            <span
                                className={`h-2 w-2 rounded-full ${statusConfig[status].dot}`}
                            />

                            {statusConfig[status].label}
                        </div>
                    ))}
                </div>

                {/* Roadmap */}
                <div className="mt-16">
                    {roadmapData.map((phase, phaseIndex) => (
                        <section
                            key={phase.title}
                            className="relative pb-16 last:pb-0"
                        >
                            {/* Phase heading */}
                            <div className="mb-7">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-medium tabular-nums text-[var(--theme-elevation-400)]">
                                        {String(phaseIndex + 1).padStart(2, '0')}
                                    </span>

                                    <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--theme-elevation-800)]">
                                        {phase.title}
                                    </h2>
                                </div>

                                {phase.description && (
                                    <p className="mt-2 max-w-2xl pl-9 text-sm leading-6 text-[var(--theme-elevation-500)]">
                                        {phase.description}
                                    </p>
                                )}
                            </div>

                            {/* Items */}
                            <div className="relative ml-4 border-l border-[var(--theme-elevation-200)]">
                                <div className="space-y-4">
                                    {phase.items.map((item) => (
                                        <RoadmapItemCard
                                            key={item.title}
                                            item={item}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>
                    ))}
                </div>
            </section>
        </main>
    )
}