import Link from 'next/link'

export default function CTA() {
    return (
        <section>
            <div className="mx-auto max-w-6xl px-6 py-24">
                <div className="rounded-[var(--style-radius-l)] bg-[var(--theme-elevation-950)] px-6 py-16 text-center sm:px-12">
                    <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">
                        Build your stack.
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-[var(--color-base-300)]">
                        Start with the Phestus core and build the rest around
                        your application.
                    </p>

                    <div className="mt-8">
                        <Link
                            href="/docs/getting-started"
                            className="inline-flex rounded-[var(--style-radius-m)] bg-white px-5 py-3 text-sm font-medium text-[var(--theme-elevation-900)] transition hover:bg-[var(--color-base-100)]"
                        >
                            Get started
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}