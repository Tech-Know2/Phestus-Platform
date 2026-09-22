type Involvement = {
    title: string
    description: string
}

type InvolvementSectionProps = {
    items: Involvement[]
}

export function InvolvementSection({
    items,
}: InvolvementSectionProps) {
    return (
        <section className="py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div>
                    <p className="text-sm font-medium uppercase tracking-wider text-[var(--theme-primary)]">
                        Get Involved
                    </p>

                    <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                        Help shape the ecosystem.
                    </h2>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-3">
                    {items.map((item) => (
                        <div
                            key={item.title}
                            className="border-l border-[var(--theme-primary)] pl-6"
                        >
                            <h3 className="font-semibold">
                                {item.title}
                            </h3>

                            <p className="mt-3 text-sm leading-6 opacity-65">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}