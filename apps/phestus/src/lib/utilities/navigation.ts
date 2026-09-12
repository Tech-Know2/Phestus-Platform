import type { Media, SiteNavigation } from '@/payload-types'

type HeaderData = NonNullable<SiteNavigation['header']>

type NavigationItem = NonNullable<
    NonNullable<HeaderData['navigation']>[number]
>

type NavigationChild = NonNullable<
    NonNullable<NavigationItem['children']>[number]
>

type FooterData = NonNullable<SiteNavigation['footer']>

type FooterColumn = NonNullable<
    NonNullable<FooterData['columns']>[number]
>

type FooterLink = NonNullable<
    NonNullable<FooterColumn['links']>[number]
>

export type NavigationLink =
    | NonNullable<NavigationItem['link']>
    | NonNullable<NavigationChild['link']>
    | NonNullable<FooterLink['link']>

export function getNavigationHref(link: NavigationLink) {
    if (link.type === 'external') {
        return link.url || '#'
    }

    if (!link.reference) {
        return '#'
    }

    const reference = link.reference

    if (typeof reference === 'number') {
        return '#'
    }

    if (!reference.value || typeof reference.value === 'number') {
        return '#'
    }

    const slug = reference.value.slug

    if (!slug) {
        return '#'
    }

    switch (reference.relationTo) {
        case 'documentation':
            return `/docs/${slug}`

        case 'posts':
            return `/posts/${slug}`

        case 'pages':
        default:
            return `/${slug}`
    }
}