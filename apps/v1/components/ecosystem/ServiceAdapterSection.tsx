import { EcosystemCard } from './EcosystemCard'

type ServiceAdapter = {
    name: string
    slug: string
    description: string
}

type ServiceAdapterSectionProps = {
    adapters: ServiceAdapter[]
}

export function ServiceAdapterSection({
    adapters,
}: ServiceAdapterSectionProps) {
    return (
        <section className="py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="max-w-2xl">
                    <p className="text-sm font-medium uppercase tracking-wider text-[var(--theme-primary)]">
                        Service Adapters
                    </p>

                    <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                        Bring your own service layer.
                    </h2>

                    <p className="mt-4 opacity-65">
                        Connect Phestus to the systems that power your application.
                    </p>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {adapters.map((adapter) => (
                        <EcosystemCard
                            key={adapter.slug}
                            name={adapter.name}
                            description={adapter.description}
                            label="Service Adapter"
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}