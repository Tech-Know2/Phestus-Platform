export type NavigationItem = {
    label: string
    href: string
    position?: 'left' | 'center' | 'right'
    order?: number
}

export type FooterColumn = {
    title: string
    links: {
        label: string
        href: string
    }[]
}

export type SiteNavigation = {
    header: {
        logo: {
            label: string
            href: string
        }
        navigation: NavigationItem[]
    }

    footer: {
        description: string
        contact?: {
            email?: string
            phone?: string
        }
        columns: FooterColumn[]
        copyright: string
    }
}

export const siteNavigation: SiteNavigation = {
    header: {
        logo: {
            label: 'Phestus',
            href: '/',
        },
        navigation: [
            {
                label: 'Docs',
                href: '/docs',
                position: 'center',
                order: 1,
            },
            {
                label: 'Blog',
                href: '/posts',
                position: 'center',
                order: 2,
            },
            {
                label: 'GitHub',
                href: 'https://github.com/phestus',
                position: 'right',
                order: 1,
            },
        ],
    },
    footer: {
        description: 'A custom and modular web stack built for a new wave of software development.',
        contact: {
            email: 'hello@phestus.dev',
        },
        columns: [
            {
                title: 'Platform',
                links: [
                    {
                        label: 'Documentation',
                        href: '/docs',
                    },
                    {
                        label: 'Blog',
                        href: '/posts',
                    },
                ],
            },
            {
                title: 'Resources',
                links: [
                    {
                        label: 'Getting Started',
                        href: '/docs/getting-started/introduction',
                    },
                    {
                        label: 'Modules',
                        href: '/docs/modules/introduction',
                    },
                    {
                        label: 'Plugins',
                        href: '/docs/plugins/introduction',
                    },
                    {
                        label: 'Providers',
                        href: '/docs/providers/introduction',
                    },
                ],
            },
            {
                title: 'Community',
                links: [
                    {
                        label: 'GitHub',
                        href: 'https://github.com/phestus',
                    },
                    {
                        label: 'Contact',
                        href: 'mailto:hello@phestus.dev',
                    },
                ],
            },
        ],
        copyright: '© 2026 Phestus. All rights reserved.',
    },
}