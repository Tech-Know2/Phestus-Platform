'use client'

import { useRouter } from 'next/navigation'

import type { DocumentationNavigationItem } from '@/lib/docs/types'

type Props = {
    sections: DocumentationNavigationItem[]
    currentSlug: string
}

function flattenSections(
    sections: DocumentationNavigationItem[],
    depth = 0,
): Array<{
    id: string
    title: string
    slug: string
    depth: number
}> {
    return sections.flatMap((section) => [
        {
            id: section.id,
            title: section.title,
            slug: section.slug,
            depth,
        },
        ...flattenSections(section.children, depth + 1),
    ])
}

export function DocsNavigationSelect({
    sections,
    currentSlug,
}: Props) {
    const router = useRouter()
    const options = flattenSections(sections)

    return (
        <select
            value={currentSlug}
            onChange={(event) => {
                router.push(`/docs/${event.target.value}`)
            }}
            className="w-full appearance-none rounded-[var(--style-radius-s)] border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-0)] px-3 py-2.5 text-sm font-medium text-[var(--theme-elevation-800)] outline-none transition-colors focus:border-[var(--theme-accent-500)] focus:ring-2 focus:ring-[var(--theme-accent-100)]"
        >
            {options.map((option) => (
                <option key={option.id} value={option.slug}>
                    {'- '.repeat(option.depth)}
                    {option.title}
                </option>
            ))}
        </select>
    )
}