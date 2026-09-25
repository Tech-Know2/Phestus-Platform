import Fuse from 'fuse.js'

import type {
    DocumentationSearchEntry,
} from './types'

export function createDocumentationSearch(
    documents: DocumentationSearchEntry[],
) {
    return new Fuse(documents, {
        keys: [
            {
                name: 'title',
                weight: 0.35,
            },
            {
                name: 'description',
                weight: 0.2,
            },
            {
                name: 'tags',
                weight: 0.15,
            },
            {
                name: 'category',
                weight: 0.1,
            },
            {
                name: 'content',
                weight: 0.2,
            },
        ],

        threshold: 0.35,
        ignoreLocation: true,
        includeMatches: true,
        minMatchCharLength: 2,
    })
}

export function createSnippet(
    content: string,
    query: string,
    radius = 100,
) {
    const normalizedContent = content.toLowerCase()
    const normalizedQuery = query.toLowerCase()

    const index = normalizedContent.indexOf(
        normalizedQuery,
    )

    if (index === -1) {
        return content.slice(0, radius * 2).trim() + '...'
    }

    const start = Math.max(0, index - radius)
    const end = Math.min(
        content.length,
        index + query.length + radius,
    )

    let snippet = content.slice(start, end).trim()

    if (start > 0) {
        snippet = `...${snippet}`
    }

    if (end < content.length) {
        snippet = `${snippet}...`
    }

    return snippet
}