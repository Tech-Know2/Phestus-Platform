import Link from 'next/link'
import type { Documentation } from '@/payload-types'

type Props = {
    doc: Documentation
}

function getParents(doc: Documentation): Documentation[] {
    const parents: Documentation[] = []

    let current = doc.parent

    while (current && typeof current !== 'number') {
        parents.unshift(current)
        current = current.parent
    }

    return parents
}

export function DocsBreadcrumbs({ doc }: Props) {
    const parents = getParents(doc)

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

            {parents.map((parent) => (
                <span
                    key={parent.id}
                    className="flex items-center gap-2"
                >
                    <span className="text-[var(--theme-elevation-300)]">
                        /
                    </span>

                    <Link
                        href={`/docs/${parent.slug}`}
                        className="text-[var(--theme-elevation-500)] transition-colors hover:text-[var(--theme-accent-600)]"
                    >
                        {parent.title}
                    </Link>
                </span>
            ))}

            <span className="flex items-center gap-2">
                <span className="text-[var(--theme-elevation-300)]">
                    /
                </span>

                <span className="font-medium text-[var(--theme-elevation-800)]">
                    {doc.title}
                </span>
            </span>
        </nav>
    )
}