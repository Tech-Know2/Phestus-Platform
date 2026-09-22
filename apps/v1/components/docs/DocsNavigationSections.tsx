'use client'

import Link from 'next/link'
import { useState } from 'react'

import type {
    DocumentationNavigationItem,
} from '@/lib/docs/types'

type Props = {
    sections: DocumentationNavigationItem[]
    currentSlug: string
}

export function DocsNavigationSections({
    sections,
    currentSlug,
}: Props) {
    const activeSection = findActiveSection(sections, currentSlug)

    const [openSections, setOpenSections] = useState<string[]>(
        activeSection ? [activeSection.id] : [],
    )

    function toggleSection(id: string) {
        setOpenSections((current) =>
            current.includes(id)
                ? current.filter((sectionId) => sectionId !== id)
                : [...current, id],
        )
    }

    return (
        <div className="space-y-2">
            {sections.map((section) => (
                <NavigationSection
                    key={section.id}
                    item={section}
                    currentSlug={currentSlug}
                    open={openSections.includes(section.id)}
                    onToggle={() => toggleSection(section.id)}
                />
            ))}
        </div>
    )
}

function NavigationSection({
    item,
    currentSlug,
    open,
    onToggle,
}: {
    item: DocumentationNavigationItem
    currentSlug: string
    open: boolean
    onToggle: () => void
}) {
    const active = currentSlug === item.slug

    if (!item.isCategory) {
        return (
            <NavigationItem
                item={item}
                currentSlug={currentSlug}
            />
        )
    }

    return (
        <div>
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between py-1 text-left text-sm font-semibold text-[var(--theme-elevation-800)] transition-colors hover:text-[var(--theme-accent-600)]"
            >
                <span>{item.title}</span>

                <span
                    className={[
                        'text-xs opacity-50 transition-transform duration-200',
                        open ? 'rotate-180' : '',
                    ].join(' ')}
                >
                    ↓
                </span>
            </button>

            <div
                className={[
                    'grid transition-[grid-template-rows] duration-200 ease-in-out',
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                ].join(' ')}
            >
                <div className="overflow-hidden">
                    {item.children.length > 0 && (
                        <div className="mt-1 space-y-0.5 border-l border-[var(--theme-elevation-150)] pl-3">
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
            </div>
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

function findActiveSection(
    sections: DocumentationNavigationItem[],
    currentSlug: string,
): DocumentationNavigationItem | undefined {
    for (const section of sections) {
        if (containsSlug(section, currentSlug)) {
            return section
        }
    }

    return undefined
}

function containsSlug(
    item: DocumentationNavigationItem,
    slug: string,
): boolean {
    if (item.slug === slug) {
        return true
    }

    return item.children.some((child) =>
        containsSlug(child, slug),
    )
}