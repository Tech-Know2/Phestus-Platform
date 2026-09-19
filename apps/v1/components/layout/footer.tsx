import Link from 'next/link'

import { siteNavigation } from '@/lib/site-navigation'

export default function Footer() {
    const { footer } = siteNavigation

    return (
        <footer className="border-t border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-0)]">
            <div className="mx-auto max-w-7xl px-6 py-14">
                <div className="grid gap-12 md:grid-cols-[2fr_3fr]">
                    {/* Brand */}
                    <div className="max-w-sm">
                        <Link
                            href={siteNavigation.header.logo.href}
                            className="text-lg font-semibold tracking-tight text-[var(--theme-elevation-900)]"
                        >
                            {siteNavigation.header.logo.label}
                        </Link>

                        <p className="mt-4 text-sm leading-6 text-[var(--theme-elevation-600)]">
                            {footer.description}
                        </p>

                        {footer.contact?.email && (
                            <a
                                href={`mailto:${footer.contact.email}`}
                                className="mt-5 inline-block text-sm text-[var(--theme-elevation-700)] transition-colors hover:text-[var(--theme-elevation-500)]"
                            >
                                {footer.contact.email}
                            </a>
                        )}

                        {footer.contact?.phone && (
                            <a
                                href={`tel:${footer.contact.phone}`}
                                className="mt-2 block text-sm text-[var(--theme-elevation-700)] transition-colors hover:text-[var(--theme-elevation-500)]"
                            >
                                {footer.contact.phone}
                            </a>
                        )}
                    </div>

                    {/* Columns */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                        {footer.columns.map((column) => (
                            <div key={column.title}>
                                <h3 className="text-sm font-semibold text-[var(--theme-elevation-900)]">
                                    {column.title}
                                </h3>

                                <ul className="mt-4 space-y-3">
                                    {column.links.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-[var(--theme-elevation-600)] transition-colors hover:text-[var(--theme-elevation-900)]"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 border-t border-[var(--theme-elevation-150)] pt-6">
                    <p className="text-sm text-[var(--theme-elevation-500)]">
                        {footer.copyright}
                    </p>
                </div>
            </div>
        </footer>
    )
}