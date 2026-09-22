type CommunityNoticeProps = {
    title: string
    description: string
}

export function CommunityNotice({
    title,
    description,
}: CommunityNoticeProps) {
    return (
        <section className="border-y border-[var(--theme-elevation-150)]">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="max-w-3xl">
                    <p className="text-sm font-medium uppercase tracking-wider text-[var(--theme-primary)]">
                        Project Notice
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold">
                        {title}
                    </h2>

                    <p className="mt-4 leading-7 opacity-65">
                        {description}
                    </p>
                </div>
            </div>
        </section>
    )
}