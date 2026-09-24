import { EcosystemCard } from './EcosystemCard'

type Provider = {
    name: string
    slug: string
    module: string
    description: string
}

type ProviderSectionProps = {
    providers: Provider[]
}

export function ProviderSection({ providers }: ProviderSectionProps) {
    return (
        <section className="border-y border-[var(--theme-elevation-150)] py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="max-w-2xl">
                    <p className="text-sm font-medium uppercase tracking-wider text-[var(--theme-primary)]">
                        Providers
                    </p>

                    <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                        Choose the implementation.
                    </h2>

                    <p className="mt-4 opacity-65">
                        Providers implement module capabilities using the technologies
                        that fit your application.
                    </p>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-2">
                    {providers.map((provider) => (
                        <EcosystemCard
                            key={provider.slug}
                            name={provider.name}
                            slug={provider.slug}
                            description={provider.description}
                            label={`${provider.module} Provider`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}