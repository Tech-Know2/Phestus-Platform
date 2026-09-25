'use client'

import { useMemo, useState } from 'react'

import {
    createDocumentationSearch,
} from '@/lib/docs/search'

import type { DocumentationSearchEntry } from '@/lib/docs/types'
import { SearchResult } from './SearchResult'

type DocsSearchProps = {
    documents: DocumentationSearchEntry[]
}

export function DocsSearch({
    documents,
}: DocsSearchProps) {
    const [query, setQuery] = useState('')

    const fuse = useMemo(
        () => createDocumentationSearch(documents),
        [documents],
    )

    const results = query.trim()
        ? fuse.search(query.trim()).slice(0, 8)
        : []

    return (
        <div className="fixed right-6 top-6 z-50 w-[360px] sm:right-8 sm:top-8 lg:right-10">
            <div className="relative">
                <div className="flex items-center overflow-hidden rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-0)] shadow-[0_8px_30px_rgba(15,35,65,0.08)] transition focus-within:border-[var(--theme-accent-400)] focus-within:shadow-[0_8px_30px_rgba(15,35,65,0.12)]">
                    <svg
                        className="ml-4 h-4 w-4 shrink-0 text-[var(--theme-elevation-500)]"
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="m14 14 4 4m-2-9a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>

                    <input
                        type="search"
                        value={query}
                        onChange={(event) =>
                            setQuery(event.target.value)
                        }
                        placeholder="Search documentation..."
                        className="h-12 w-full bg-transparent px-3 text-sm text-[var(--theme-elevation-900)] outline-none placeholder:text-[var(--theme-elevation-500)]"
                    />

                    <span className="mr-3 hidden shrink-0 rounded-[var(--style-radius-s)] border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-50)] px-2 py-1 text-[10px] font-medium tracking-wide text-[var(--theme-elevation-500)] sm:block">
                        ⌘ K
                    </span>
                </div>

                {query.trim() && (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] overflow-hidden rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-0)] shadow-[0_16px_40px_rgba(15,35,65,0.12)]">
                        {results.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <p className="text-sm font-medium text-[var(--theme-elevation-700)]">
                                    No documentation found
                                </p>

                                <p className="mt-1 text-xs text-[var(--theme-elevation-500)]">
                                    Try a different search term.
                                </p>
                            </div>
                        ) : (
                            <div className="max-h-[min(70vh,600px)] overflow-y-auto py-2">
                                {results.map((result) => (
                                    <SearchResult
                                        key={result.item.slug}
                                        result={result}
                                        query={query}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}