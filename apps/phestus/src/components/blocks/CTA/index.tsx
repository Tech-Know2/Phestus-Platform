import React from 'react'

type CallToActionProps = {
    title?: string
    description?: string
    link?: {
        label?: string
        url?: string
    }
}

export function CallToAction({
    title,
    description,
    link,
}: CallToActionProps) {
    return (
        <section className="bg-[var(--theme-elevation-50)]">
            <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10">
                <div className="rounded-[var(--style-radius-l)] border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-0)] p-8 shadow-[0_1px_3px_rgba(15,35,65,0.05)] sm:p-10">
                    <div className="max-w-2xl">
                        {title && (
                            <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[var(--theme-elevation-900)] sm:text-3xl">
                                {title}
                            </h2>
                        )}

                        {description && (
                            <p className="mt-3 text-base leading-7 text-[var(--theme-elevation-600)]">
                                {description}
                            </p>
                        )}

                        {link?.url && link?.label && (
                            <a
                                href={link.url}
                                className="mt-6 inline-flex rounded-[var(--style-radius-m)] bg-[var(--theme-accent-600)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--theme-accent-700)]"
                            >
                                {link.label}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}