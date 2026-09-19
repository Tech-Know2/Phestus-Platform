import Link from 'next/link'

import {
    getDocumentationNavigation,
} from '@/lib/docs'

import type {
    Documentation,
    DocumentationNavigationItem,
} from '@/lib/docs/types'

import { DocsNavigationSelect } from './DocsNavigationSelect'

type Props = {
    currentDoc: Documentation
}

export async function DocsNavigation({ currentDoc }: Props) {
    const sections = await getDocumentationNavigation()

    return (
        <nav className="w-full">
            <div className="mb-5">
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--theme-elevation-500)]">
                    Documentation
                </span>
            </div>

            <div className="mb-6 lg:hidden">
                <DocsNavigationSelect
                    sections={sections}
                    currentSlug={currentDoc.slug}
                />
            </div>

            <div className="space-y-7">
                {sections.map((section) => (
                    <NavigationSection
                        key={section.id}
                        item={section}
                        currentSlug={currentDoc.slug}
                    />
                ))}
            </div>
        </nav>
    )
}

function NavigationSection({
    item,
    currentSlug,
}: {
    item: DocumentationNavigationItem
    currentSlug: string
}) {
    const active = currentSlug === item.slug

    return (
        <div>
            {item.isCategory ? (
                <div className="mb-2 text-sm font-semibold text-[var(--theme-elevation-800)]">
                    {item.title}
                </div>
            ) : (
                <Link
                    href={`/docs/${item.slug}`}
                    className={[
                        'mb-2 block text-sm font-semibold transition-colors',
                        active
                            ? 'text-[var(--theme-accent-600)]'
                            : 'text-[var(--theme-elevation-800)] hover:text-[var(--theme-accent-600)]',
                    ].join(' ')}
                >
                    {item.title}
                </Link>
            )}

            {item.children.length > 0 && (
                <div className="space-y-0.5 border-l border-[var(--theme-elevation-150)] pl-3">
                    {item.children.map((child) => (
                        <NavigationItem
                            key={child.id}
                            item={child}
                            currentSlug={currentSlug}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

function NavigationItem({
    item,
    currentSlug,
}: {
    item: DocumentationNavigationItem
    currentSlug: string
}) {
    const active = currentSlug === item.slug

    return (
        <div>
            <Link
                href={`/docs/${item.slug}`}
                className={[
                    'block rounded-[var(--style-radius-s)] px-3 py-1.5 text-sm transition-colors',
                    active
                        ? 'bg-[var(--theme-accent-50)] font-medium text-[var(--theme-accent-700)]'
                        : 'text-[var(--theme-elevation-600)] hover:bg-[var(--theme-elevation-50)] hover:text-[var(--theme-elevation-900)]',
                ].join(' ')}
            >
                {item.title}
            </Link>

            {item.children.length > 0 && (
                <div className="ml-3 border-l border-[var(--theme-elevation-150)] pl-3">
                    {item.children.map((child) => (
                        <NavigationItem
                            key={child.id}
                            item={child}
                            currentSlug={currentSlug}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}