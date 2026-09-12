import Image from 'next/image'
import Link from 'next/link'
import type { Media, SiteNavigation } from '@/payload-types'

type FooterData = NonNullable<SiteNavigation['footer']>

type FooterColumn = NonNullable<
    NonNullable<FooterData['columns']>[number]
>

type FooterLink = NonNullable<
    NonNullable<FooterColumn['links']>[number]
>

type FooterProps = {
    data: FooterData
}

function getMedia(media: number | Media | null | undefined) {
    if (!media || typeof media === 'number' || !media.url) {
        return null
    }

    return media
}

function getHref(link: NonNullable<FooterLink['link']>) {
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

export function Footer({ data }: FooterProps) {
    const year = new Date().getFullYear()

    const lightLogo = getMedia(data.logo?.light)
    const darkLogo = getMedia(data.logo?.dark)

    return (
        <footer className="mt-20 border-t border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-50)] max-[640px]:mt-14">
            <div className="mx-auto w-[min(100%-40px,1200px)] max-[640px]:w-[calc(100%-28px)]">
                <div className="grid grid-cols-[1fr_2fr] gap-20 py-16 max-[900px]:grid-cols-1 max-[900px]:gap-12 max-[640px]:py-12">
                    <div className="flex flex-col items-start">
                        <Link
                            href="/"
                            aria-label="Home"
                            className="inline-flex"
                        >
                            {lightLogo?.url && (
                                <Image
                                    src={lightLogo.url}
                                    alt={lightLogo.alt || 'Logo'}
                                    width={140}
                                    height={40}
                                    className="block h-8 w-auto object-contain dark:hidden"
                                />
                            )}

                            {darkLogo?.url && (
                                <Image
                                    src={darkLogo.url}
                                    alt={darkLogo.alt || 'Logo'}
                                    width={140}
                                    height={40}
                                    className="hidden h-8 w-auto object-contain dark:block"
                                />
                            )}
                        </Link>

                        {(data.description ||
                            data.email ||
                            data.phone) && (
                                <div className="mt-5 flex max-w-[280px] flex-col gap-3">
                                    {data.description && (
                                        <p className="m-0 text-[13px] leading-[1.6] text-[var(--theme-elevation-500)]">
                                            {data.description}
                                        </p>
                                    )}

                                    {(data.email || data.phone) && (
                                        <div className="flex flex-col gap-1">
                                            {data.email && (
                                                <Link
                                                    href={`mailto:${data.email}`}
                                                    className="text-[13px] leading-[1.4] text-[var(--theme-elevation-600)] no-underline transition-colors duration-150 hover:text-[var(--theme-accent-600)]"
                                                >
                                                    {data.email}
                                                </Link>
                                            )}

                                            {data.phone && (
                                                <Link
                                                    href={`tel:${data.phone}`}
                                                    className="text-[13px] leading-[1.4] text-[var(--theme-elevation-600)] no-underline transition-colors duration-150 hover:text-[var(--theme-accent-600)]"
                                                >
                                                    {data.phone}
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>

                    <div className="grid grid-cols-4 gap-10 max-[640px]:grid-cols-3 max-[640px]:gap-x-6 max-[640px]:gap-y-9">
                        {data.columns?.map((column) => (
                            <div
                                key={column.id || column.title}
                                className="flex flex-col gap-[15px]"
                            >
                                <h2 className="m-0 font-[var(--font-body)] text-[13px] font-semibold tracking-[-0.01em] text-[var(--theme-elevation-900)]">
                                    {column.title}
                                </h2>

                                <nav
                                    aria-label={column.title}
                                    className="flex flex-col items-start gap-[9px]"
                                >
                                    {column.links?.map((item) => {
                                        if (!item.link) {
                                            return null
                                        }

                                        return (
                                            <Link
                                                key={item.id || item.label}
                                                href={getHref(item.link)}
                                                target={
                                                    item.link.newTab
                                                        ? '_blank'
                                                        : undefined
                                                }
                                                rel={
                                                    item.link.newTab
                                                        ? 'noopener noreferrer'
                                                        : undefined
                                                }
                                                className="inline-flex items-center gap-[5px] text-[13px] leading-[1.4] text-[var(--theme-elevation-600)] no-underline transition-colors duration-150 hover:text-[var(--theme-accent-600)]"
                                            >
                                                {item.label}
                                            </Link>
                                        )
                                    })}
                                </nav>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--theme-elevation-150)] py-5 text-[12px] text-[var(--theme-elevation-500)] max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-2">
                    <p className="m-0">
                        {data.copyright ||
                            `© ${year} All rights reserved.`}
                    </p>

                    <p className="m-0">
                        Powered by{' '}
                        <span className="font-medium text-[var(--theme-elevation-700)]">
                            Phestus
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    )
}