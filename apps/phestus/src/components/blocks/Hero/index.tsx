import React from 'react'

type HeroProps = {
    title?: string
    description?: string
    link?: {
        label?: string
        url?: string
    }
}

export function Hero({ title, description, link }: HeroProps) {
    return (
        <section className="border-b border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-0)]">
            <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28 lg:px-10">
                <div className="max-w-3xl">
                    {title && (
                        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[var(--theme-elevation-950)] sm:text-5xl lg:text-6xl">
                            {title}
                        </h1>
                    )}

                    {description && (
                        <p className="mt-6 text-lg leading-8 text-[var(--theme-elevation-600)] sm:text-xl">
                            {description}
                        </p>
                    )}

                    {link?.url && link?.label && (
                        <a
                            href={link.url}
                            className="mt-8 inline-flex rounded-[var(--style-radius-m)] bg-[var(--theme-accent-600)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--theme-accent-700)]"
                        >
                            {link.label}
                        </a>
                    )}
                </div>
            </div>
        </section>
    )
}