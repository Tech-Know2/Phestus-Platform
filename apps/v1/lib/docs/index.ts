import fs from 'fs/promises'
import path from 'path'

import matter from 'gray-matter'

import type {
    Documentation,
    DocumentationSearchEntry,
    DocumentationHeading,
    DocumentationNavigationItem,
} from './types'

const DOCS_DIR = path.join(process.cwd(), 'doc_readme')

function slugToTitle(slug: string) {
    return slug
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function createHeadingId(title: string) {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

export function getMarkdownHeadings(
    content: string,
): DocumentationHeading[] {
    const headings: DocumentationHeading[] = []

    for (const line of content.split('\n')) {
        const match = line.match(/^(#{2,6})\s+(.+)$/)

        if (!match) {
            continue
        }

        const level = match[1].length
        const title = match[2].trim()

        headings.push({
            id: createHeadingId(title),
            title,
            level,
        })
    }

    return headings
}

async function readDirectory(
    directory: string,
    parentSlug = '',
): Promise<DocumentationNavigationItem[]> {
    const entries = await fs.readdir(directory, {
        withFileTypes: true,
    })

    const items: DocumentationNavigationItem[] = []

    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name)

        if (entry.isDirectory()) {
            const slug = parentSlug
                ? `${parentSlug}/${entry.name}`
                : entry.name

            const children = await readDirectory(
                fullPath,
                slug,
            )

            let title = slugToTitle(entry.name)
            let order = 0

            const indexPath = path.join(
                fullPath,
                'index.md',
            )

            try {
                const indexContent = await fs.readFile(
                    indexPath,
                    'utf8',
                )

                const parsed = matter(indexContent)

                title =
                    parsed.data.title ??
                    slugToTitle(entry.name)

                order = parsed.data.order ?? 0
            } catch {
                // No index.md
            }

            items.push({
                id: slug,
                title,
                slug,
                order,
                isCategory: true,
                children,
            })

            continue
        }

        if (!entry.isFile() || !entry.name.endsWith('.md')) {
            continue
        }

        if (entry.name === 'index.md') {
            continue
        }

        const content = await fs.readFile(
            fullPath,
            'utf8',
        )

        const parsed = matter(content)

        const filename = entry.name.replace(/\.md$/, '')

        const slug = parentSlug
            ? `${parentSlug}/${filename}`
            : filename

        items.push({
            id: slug,
            title:
                parsed.data.title ??
                slugToTitle(filename),
            slug,
            order: parsed.data.order ?? 0,
            isCategory: false,
            children: [],
        })
    }

    return items.sort((a, b) => {
        if (a.order !== b.order) {
            return a.order - b.order
        }

        return a.title.localeCompare(b.title)
    })
}

export async function getDocumentation(
    slug: string,
): Promise<Documentation | null> {
    try {
        const filePath = path.join(
            DOCS_DIR,
            `${slug}.md`,
        )

        const content = await fs.readFile(
            filePath,
            'utf8',
        )

        const parsed = matter(content)

        return {
            title:
                parsed.data.title ??
                slugToTitle(path.basename(slug)),
            description:
                parsed.data.description ?? '',
            slug:
                parsed.data.slug ?? slug,
            tags:
                parsed.data.tags ?? [],
            content: parsed.content,
            order: parsed.data.order ?? 0,
            headings: getMarkdownHeadings(parsed.content),
        }
    } catch {
        return null
    }
}

export async function getDocumentationNavigation() {
    return readDirectory(DOCS_DIR)
}

function markdownToText(content: string) {
    return content
        .replace(/```[\s\S]*?```/g, (match) =>
            match.replace(/^```[^\n]*\n?/, '').replace(/```$/, ''),
        )
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/#{1,6}\s+/g, '')
        .replace(/[*_~`]/g, '')
        .replace(/^\s*[-*+]\s+/gm, '')
        .replace(/^\s*\d+\.\s+/gm, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
}

async function readSearchDirectory(
    directory: string,
    parentSlug = '',
): Promise<DocumentationSearchEntry[]> {
    const entries = await fs.readdir(directory, {
        withFileTypes: true,
    })

    const documents: DocumentationSearchEntry[] = []

    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name)

        if (entry.isDirectory()) {
            const slug = parentSlug
                ? `${parentSlug}/${entry.name}`
                : entry.name

            const children = await readSearchDirectory(
                fullPath,
                slug,
            )

            documents.push(...children)
            continue
        }

        if (
            !entry.isFile() ||
            !entry.name.endsWith('.md') ||
            entry.name === 'index.md'
        ) {
            continue
        }

        const rawContent = await fs.readFile(
            fullPath,
            'utf8',
        )

        const parsed = matter(rawContent)

        const filename = entry.name.replace(/\.md$/, '')

        const slug = parentSlug
            ? `${parentSlug}/${filename}`
            : filename

        const category = parentSlug
            ? parentSlug
                .split('/')
                .pop() ?? ''
            : ''

        documents.push({
            title:
                parsed.data.title ??
                slugToTitle(filename),

            slug:
                parsed.data.slug ??
                slug,

            description:
                parsed.data.description ?? '',

            tags:
                Array.isArray(parsed.data.tags)
                    ? parsed.data.tags
                    : [],

            content: markdownToText(
                parsed.content,
            ),

            category: slugToTitle(category),
        })
    }

    return documents
}

export async function getDocumentationSearchIndex() {
    return readSearchDirectory(DOCS_DIR)
}