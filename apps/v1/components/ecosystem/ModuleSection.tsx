import { EcosystemCard } from './EcosystemCard'

type Module = {
    name: string
    slug: string
    description: string
}

type ModuleSectionProps = {
    modules: Module[]
}

export function ModuleSection({ modules }: ModuleSectionProps) {
    return (
        <section className="py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="max-w-2xl">
                    <p className="text-sm font-medium uppercase tracking-wider text-[var(--theme-primary)]">
                        Modules
                    </p>

                    <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                        Capabilities, not implementations.
                    </h2>

                    <p className="mt-4 opacity-65">
                        Modules define what Phestus can do while leaving the underlying
                        implementation to providers.
                    </p>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {modules.map((module) => (
                        <EcosystemCard
                            key={module.slug}
                            name={module.name}
                            slug={module.slug}
                            description={module.description}
                            label="Module"
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}