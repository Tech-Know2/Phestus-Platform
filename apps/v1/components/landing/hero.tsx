import Link from 'next/link'

export default function Hero() {
    return (
        <section className="border-b border-[var(--theme-elevation-150)]">
            <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
                <div className="max-w-3xl">
                    <div className="mb-6 inline-flex items-center rounded-full border border-[var(--theme-accent-200)] bg-[var(--theme-accent-50)] px-3 py-1 text-sm font-medium text-[var(--theme-accent-700)]">
                        A modular web stack
                    </div>

                    <h1 className="text-5xl font-semibold tracking-[-0.04em] text-[var(--theme-elevation-900)] sm:text-6xl lg:text-7xl">
                        Build software your way.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--theme-elevation-600)]">
                        Phestus is a customizable web stack built around
                        modules, providers, plugins, and services. Build the
                        foundation your application actually needs.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/docs"
                            className="rounded-[var(--style-radius-m)] bg-[var(--theme-accent-600)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--theme-accent-700)]"
                        >
                            Read the docs
                        </Link>

                        <Link
                            href="https://github.com/Tech-Know2/Phestus-Platform"
                            className="rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-0)] px-5 py-3 text-sm font-medium text-[var(--theme-elevation-800)] transition hover:bg-[var(--theme-elevation-50)]"
                        >
                            Explore Source Code
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
