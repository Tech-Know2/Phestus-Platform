const features = [
    {
        title: 'Modular by design',
        description:
            'Add only the capabilities your application needs without coupling your entire stack together.',
    },
    {
        title: 'Built to extend',
        description:
            'Create your own modules, providers, plugins, and services while keeping the core runtime small.',
    },
    {
        title: 'Your infrastructure',
        description:
            'Choose the technologies behind your application instead of being locked into a single implementation.',
    },
]

export default function Features() {
    return (
        <section className="border-b border-[var(--theme-elevation-150)]">
            <div className="mx-auto max-w-6xl px-6 py-20">
                <div className="max-w-2xl">
                    <p className="text-sm font-medium text-[var(--theme-accent-600)]">
                        Why Phestus
                    </p>

                    <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[var(--theme-elevation-900)]">
                        A foundation, not a restriction.
                    </h2>

                    <p className="mt-4 text-[var(--theme-elevation-600)]">
                        Phestus provides the structure for your application
                        while leaving implementation details in your hands.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-150)] p-6"
                        >
                            <h3 className="font-semibold text-[var(--theme-elevation-900)]">
                                {feature.title}
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-[var(--theme-elevation-600)]">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}