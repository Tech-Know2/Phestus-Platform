type Feature = {
    title: string
    description: string
}

type FeatureGridProps = {
    features: Feature[]
}

export function FeatureGrid({ features }: FeatureGridProps) {
    return (
        <section className="py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-px overflow-hidden rounded-lg border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-150)] md:grid-cols-2">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="bg-[var(--theme-elevation-0)] p-8"
                        >
                            <h2 className="text-lg font-semibold">
                                {feature.title}
                            </h2>

                            <p className="mt-3 text-sm leading-6 opacity-65">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}