type EcosystemHeroProps = {
    data: {
        eyebrow: string
        title: string
        description: string
    }
}

export function PageHero({ data }: EcosystemHeroProps) {
    return (
        <section className="border-b border-[var(--theme-elevation-150)]">
            <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                <div className="max-w-3xl">
                    <p className="mb-4 text-sm font-medium uppercase tracking-wider text-[var(--theme-primary)]">
                        {data.eyebrow}
                    </p>

                    <h1 className="text-4xl font-semibold tracking-tight text-[var(--theme-text)] md:text-6xl">
                        {data.title}
                    </h1>

                    <p className="mt-6 text-lg leading-8 text-[var(--theme-text)] opacity-70">
                        {data.description}
                    </p>
                </div>
            </div>
        </section>
    )
}