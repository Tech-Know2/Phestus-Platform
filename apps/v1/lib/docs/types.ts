export type Documentation = {
    title: string
    slug: string
    description: string
    tags: string[]
    content: string
    order: number
}

export type DocumentationNavigationItem = {
    id: string
    title: string
    slug: string
    order: number
    isCategory: boolean
    children: DocumentationNavigationItem[]
}