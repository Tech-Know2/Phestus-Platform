import Link from 'next/link'

import type { DocumentationHeading } from '@/lib/docs/types'

type Props = {
    headings: DocumentationHeading[]
}

export function DocsOnThisPage({ headings }: Props) {
    console.log('On this page headings:', headings)

    if (!headings.length) {
        return (
            <div className="border-l border-[var(--theme-elevation-150)] pl-5">
                <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--theme-elevation-500)]">
                    On this page
                </span>
            </div>
        )
    }

    return (
        <div className="border-l border-[var(--theme-elevation-150)] pl-5">
            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--theme-elevation-500)]">
                On this page
            </span>

            <nav>
                <ul className="space-y-2">
                    {headings.map((heading) => (
                        <li key={heading.id}>
                            <Link
                                href={`#${heading.id}`}
                                className={[
                                    'block text-[13px] leading-5',
                                    'text-[var(--theme-elevation-500)]',
                                    'transition-colors hover:text-[var(--theme-elevation-900)]',
                                    heading.level > 2 ? 'pl-3' : '',
                                ].join(' ')}
                            >
                                {heading.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}