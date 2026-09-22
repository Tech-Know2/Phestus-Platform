export type Documentation = {
    title: string
    slug: string
    description: string
    tags: string[]
    content: string
    order: number
    headings: DocumentationHeading[]
}

export type DocumentationNavigationItem = {
    id: string
    title: string
    slug: string
    order: number
    isCategory: boolean
    children: DocumentationNavigationItem[]
}

export type DocumentationHeading = {
    id: string
    title: string
    level: number
}