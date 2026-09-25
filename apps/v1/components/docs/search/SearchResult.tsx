import { createSnippet } from '@/lib/docs/search'
import type { DocumentationSearchEntry } from '@/lib/docs/types'
import type { FuseResult } from 'fuse.js'

export function SearchResult({
    result,
    query,
}: {
    result: FuseResult<DocumentationSearchEntry>
    query: string
}) {
    const snippet = createSnippet(
        result.item.content,
        query,
    )

    return (
        <a
            href={`/docs/${result.item.slug}`}
            className="group block border-b border-[var(--theme-elevation-100)] px-4 py-3.5 transition last:border-b-0 hover:bg-[var(--theme-elevation-50)]"
        >
            <div className="mb-1.5 flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--theme-accent-600)]">
                    {result.item.category}
                </span>

                <span className="text-[var(--theme-elevation-300)]">
                    /
                </span>

                <span className="truncate text-[10px] text-[var(--theme-elevation-500)]">
                    {result.item.slug}
                </span>
            </div>

            <h3 className="text-sm font-semibold tracking-[-0.01em] text-[var(--theme-elevation-900)] transition-colors group-hover:text-[var(--theme-accent-600)]">
                {result.item.title}
            </h3>

            {result.item.description && (
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--theme-elevation-600)]">
                    {result.item.description}
                </p>
            )}

            <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-[var(--theme-elevation-500)]">
                {snippet}
            </p>
        </a>
    )
}