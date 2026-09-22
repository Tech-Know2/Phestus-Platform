type EcosystemCardProps = {
    name: string
    description: string
    label?: string
}

export function EcosystemCard({
    name,
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

            <p className="mt-3 text-sm leading-6 text-[var(--theme-text)] opacity-65">
                {description}
            </p>
        </div>
    )
}