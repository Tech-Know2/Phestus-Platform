export default function Architecture() {
    return (
        <section className="border-b border-[var(--theme-elevation-150)]">
            <div className="mx-auto max-w-6xl px-6 py-20">
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                    <div>
                        <p className="text-sm font-medium text-[var(--theme-accent-600)]">
                            Architecture
                        </p>

                        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[var(--theme-elevation-900)]">
                            Capabilities separated from implementation.
                        </h2>

                        <p className="mt-4 leading-7 text-[var(--theme-elevation-600)]">
                            Modules define what your application can do.
                            Providers define how those capabilities are
                            implemented. Plugins bring everything together.
                        </p>

                        <p className="mt-4 leading-7 text-[var(--theme-elevation-600)]">
                            This lets you change infrastructure without
                            rewriting the application layer built on top of
                            it.
                        </p>
                    </div>

                    <div className="rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-50)] p-6">
                        <div className="space-y-3 font-mono text-sm">
                            <div className="rounded-[var(--style-radius-s)] bg-[var(--theme-elevation-0)] px-4 py-3 text-[var(--theme-elevation-800)]">
                                Application
                            </div>

                            <div className="flex justify-center text-[var(--theme-accent-500)]">
                                ↓
                            </div>

                            <div className="rounded-[var(--style-radius-s)] bg-[var(--theme-elevation-0)] px-4 py-3 text-[var(--theme-elevation-800)]">
                                Plugins
                            </div>

                            <div className="flex justify-center text-[var(--theme-accent-500)]">
                                ↓
                            </div>

                            <div className="rounded-[var(--style-radius-s)] bg-[var(--theme-elevation-0)] px-4 py-3 text-[var(--theme-elevation-800)]">
                                Modules
                            </div>

                            <div className="flex justify-center text-[var(--theme-accent-500)]">
                                ↓
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-[var(--style-radius-s)] bg-[var(--theme-elevation-0)] px-4 py-3 text-center text-[var(--theme-elevation-700)]">
                                    Providers
                                </div>

                                <div className="rounded-[var(--style-radius-s)] bg-[var(--theme-elevation-0)] px-4 py-3 text-center text-[var(--theme-elevation-700)]">
                                    Services
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}