type Project = {
    name: string
    description: string
    author: string
    tags: string[]
    href: string
}

type ProjectHighlightsProps = {
    projects: Project[]
}

export function ProjectHighlights({
    projects,
}: ProjectHighlightsProps) {
    return (
        <section className="border-t border-[var(--theme-elevation-150)] py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="max-w-2xl">
                    <p className="text-sm font-medium uppercase tracking-wider text-[var(--theme-primary)]">
                        Community Projects
                    </p>

                    <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                        What people are building.
                    </h2>

                    <p className="mt-4 opacity-65">
                        A place to showcase projects, experiments, and applications
                        built with Phestus.
                    </p>
                </div>

                {projects.length > 0 ? (
                    <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <a
                                key={project.name}
                                href={project.href}
                                className="group rounded-lg border border-[var(--theme-elevation-150)] p-6 transition-colors hover:bg-[var(--theme-elevation-50)]"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">
                                        {project.name}
                                    </h3>

                                    <span className="opacity-40 transition-transform group-hover:translate-x-1">
                                        →
                                    </span>
                                </div>

                                <p className="mt-4 text-sm leading-6 opacity-65">
                                    {project.description}
                                </p>

                                <div className="mt-6 flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full border border-[var(--theme-elevation-150)] px-3 py-1 text-xs opacity-60"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="mt-10 rounded-lg border border-dashed border-[var(--theme-elevation-150)] px-6 py-12 text-center">
                        <p className="text-lg font-medium">
                            Community projects are coming soon.
                        </p>

                        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 opacity-60">
                            There are no community projects to showcase yet.
                            Check back soon to see what people are building
                            with Phestus.
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}