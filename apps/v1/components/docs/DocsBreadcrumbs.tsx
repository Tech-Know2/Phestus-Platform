import Link from 'next/link'

import type { Documentation } from '@/lib/docs/types'

type Props = {
    doc: Documentation
}

export function DocsBreadcrumbs({ doc }: Props) {
    return (
        <nav
            className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm"
            aria-label="Breadcrumb"
        >
            <Link
                href="/docs"
                className="text-[var(--theme-elevation-500)] transition-colors hover:text-[var(--theme-accent-600)]"
            >
                Docs
            </Link>

            <span className="text-[var(--theme-elevation-300)]">
                /
            </span>

            <span className="font-medium text-[var(--theme-elevation-800)]">
                {doc.title}
            </span>
        </nav>
    )
}