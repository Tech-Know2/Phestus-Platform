type EcosystemCardProps = {
    name: string
    slug: string
    description: string
    label?: string
}

export function EcosystemCard({
    name,
    slug,
    description,
    label,
}: EcosystemCardProps) {
    return (
        <div className="rounded-lg border border-[var(--theme-elevation-150)] p-6 transition-colors hover:bg-[var(--theme-elevation-50)]">
            {label && (
                <p className="mb-3 text-xs font-medium uppercase tracking-wider opacity-50">
                    {label}
                </p>
            )}

            <h3 className="text-lg font-semibold text-[var(--theme-text)]">
                {name}
            </h3>

            <span className="mt-2 inline-block rounded-md bg-[var(--color-accent-50)] px-2 py-1 text-xs font-medium uppercase tracking-wide text-[var(--theme-text)]">
                {slug}
            </span>

            <p className="mt-3 text-sm leading-6 text-[var(--theme-text)] opacity-65">
                {description}
            </p>
        </div>
    )
}