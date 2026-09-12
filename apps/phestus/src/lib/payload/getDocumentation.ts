import { getPayload } from 'payload'
import config from '@payload-config'

export type DocumentationNavigationItem = {
    id: string
    title: string
    slug: string
    order: number
    parent: string | null
    children: DocumentationNavigationItem[]
}

export async function getDocumentation(slug: string) {
    const payload = await getPayload({ config })

    const result = await payload.find({
        collection: 'documentation',
        where: {
            and: [
                {
                    slug: {
                        equals: slug,
                    },
                },
                {
                    status: {
                        equals: 'published',
                    },
                },
            ],
        },
        limit: 1,
        depth: 10,
    })

    return result.docs[0] ?? null
}

export async function getDocumentationNavigation() {
    const payload = await getPayload({ config })

    const result = await payload.find({
        collection: 'documentation',
        where: {
            status: {
                equals: 'published',
            },
        },
        limit: 1000,
        depth: 0,
    })

    const items: DocumentationNavigationItem[] = result.docs.map((doc) => ({
        id: String(doc.id),
        title: doc.title,
        slug: doc.slug,
        order: Number(doc.order ?? 0),
        parent:
            typeof doc.parent === 'number'
                ? String(doc.parent)
                : doc.parent
                    ? String(doc.parent.id)
                    : null,
        children: [],
    }))

    const map = new Map(
        items.map((item) => [item.id, item]),
    )

    const roots: DocumentationNavigationItem[] = []

    for (const item of items) {
        if (!item.parent) {
            roots.push(item)
            continue
        }

        const parent = map.get(item.parent)

        if (parent) {
            parent.children.push(item)
        }
    }

    const sortTree = (items: DocumentationNavigationItem[]) => {
        items.sort((a, b) => {
            const orderDifference = a.order - b.order

            if (orderDifference !== 0) {
                return orderDifference
            }

            return a.title.localeCompare(b.title)
        })

        for (const item of items) {
            sortTree(item.children)
        }
    }

    sortTree(roots)

    console.log(
        roots.map((item) => ({
            title: item.title,
            order: item.order,
            children: item.children.map((child) => ({
                title: child.title,
                order: child.order,
            })),
        })),
    )

    return roots
}