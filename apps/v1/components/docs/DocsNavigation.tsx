import {
    getDocumentationNavigation,
} from '@/lib/docs'

import type {
    Documentation,
} from '@/lib/docs/types'

import { DocsNavigationSelect } from './DocsNavigationSelect'
import { DocsNavigationSections } from './DocsNavigationSections'

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

            <DocsNavigationSections
                sections={sections}
                currentSlug={currentDoc.slug}
            />
        </nav>
    )
}