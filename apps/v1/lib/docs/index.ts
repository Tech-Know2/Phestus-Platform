import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

import type {
    Documentation,
    DocumentationNavigationItem,
} from './types'

const DOCS_DIR = path.join(process.cwd(), 'doc_readme')

function slugToTitle(slug: string) {
    return slug
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
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

            const indexPath = path.join(fullPath, 'index.md')

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

        const content = await fs.readFile(fullPath, 'utf8')
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
        }
    } catch {
        return null
    }
}

export async function getDocumentationNavigation() {
    return readDirectory(DOCS_DIR)
}