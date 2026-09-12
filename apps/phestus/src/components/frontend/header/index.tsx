import Image from 'next/image'
import Link from 'next/link'
import type { Media, SiteNavigation } from '@/payload-types'

type HeaderData = NonNullable<SiteNavigation['header']>

type NavigationItem = NonNullable<
    NonNullable<HeaderData['navigation']>[number]
>

type NavigationChild = NonNullable<
    NonNullable<NavigationItem['children']>[number]
>

type HeaderProps = {
    data: HeaderData
}

function getMedia(
    media: number | Media | null | undefined,
) {
    if (!media || typeof media === 'number' || !media.url) {
        return null
    }

    return media
}

function getHref(
    link:
        | NonNullable<NavigationItem['link']>
        | NonNullable<NavigationChild['link']>,
) {
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

function NavigationLink({
    item,
    dropdown = false,
}: {
    item: NavigationItem | NavigationChild
    dropdown?: boolean
}) {
    if (!item.link) {
        return null
    }

    const href = getHref(item.link)

    return (
        <Link
            href={href}
            target={item.link.newTab ? '_blank' : undefined}
            rel={item.link.newTab ? 'noopener noreferrer' : undefined}
            className={
                dropdown
                    ? 'flex flex-col gap-[3px] rounded-[var(--style-radius-s)] px-[11px] py-[10px] text-[var(--theme-elevation-800)] no-underline transition-colors duration-150 hover:bg-[var(--theme-accent-50)] hover:text-[var(--theme-accent-600)]'
                    : 'inline-flex items-center gap-1.5 rounded-[var(--style-radius-s)] px-[11px] py-2 text-[14px] font-medium leading-none text-[var(--theme-elevation-700)] no-underline transition-colors duration-150 hover:bg-[var(--theme-elevation-50)] hover:text-[var(--theme-elevation-950)]'
            }
        >
            <span className={dropdown ? 'flex items-center gap-1.5' : ''}>
                {item.label}
            </span>

            {'description' in item && item.description && (
                <span className="text-[12px] leading-[1.4] text-[var(--theme-elevation-500)]">
                    {item.description}
                </span>
            )}
        </Link>
    )
}

function Navigation({
    items = [],
    mobile = false,
}: {
    items?: NavigationItem[]
    mobile?: boolean
}) {
    return (
        <nav
            aria-label="Main navigation"
            className={
                mobile
                    ? 'flex flex-col gap-0.5'
                    : 'flex items-center gap-1'
            }
        >
            {items.map((item) => {
                const hasChildren = Boolean(item.children?.length)

                if (!hasChildren) {
                    return (
                        <NavigationLink
                            key={item.id || item.label}
                            item={item}
                        />
                    )
                }

                return (
                    <details
                        key={item.id || item.label}
                        className={
                            mobile
                                ? 'w-full'
                                : 'relative'
                        }
                    >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-1.5 rounded-[var(--style-radius-s)] px-[11px] py-2 text-[14px] font-medium leading-none text-[var(--theme-elevation-700)] transition-colors duration-150 hover:bg-[var(--theme-elevation-50)] hover:text-[var(--theme-elevation-950)] [&::-webkit-details-marker]:hidden"
                        >
                            <span>{item.label}</span>
                        </summary>

                        <div
                            className={
                                mobile
                                    ? 'static min-w-0 border-0 py-0 pl-3 shadow-none'
                                    : 'absolute left-1/2 top-[calc(100%+10px)] min-w-[230px] -translate-x-1/2 rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-0)] p-1.5 shadow-[0_12px_30px_rgba(15,35,65,0.08),0_2px_6px_rgba(15,35,65,0.04)]'
                            }
                        >
                            {item.children?.map((child) => (
                                <NavigationLink
                                    key={child.id || child.label}
                                    item={child}
                                    dropdown
                                />
                            ))}
                        </div>
                    </details>
                )
            })}
        </nav>
    )
}

export function Header({ data }: HeaderProps) {
    const lightLogo = getMedia(data.logo?.light)
    const darkLogo = getMedia(data.logo?.dark)

    const navigation = data.navigation || []

    const left = navigation.filter(
        (item) => item.location === 'left',
    )

    const center = navigation.filter(
        (item) => item.location === 'center',
    )

    const right = navigation.filter(
        (item) =>
            item.location === 'right' ||
            !item.location,
    )

    return (
        <header className="relative z-50 border-b border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-0)]">
            <div className="mx-auto flex min-h-[72px] w-[min(100%-40px,1200px)] items-center max-[640px]:min-h-16 max-[640px]:w-[calc(100%-28px)]">
                <Link
                    href="/"
                    aria-label="Home"
                    className="flex shrink-0 items-center"
                >
                    {lightLogo?.url && (
                        <Image
                            src={lightLogo.url}
                            alt={
                                data.logo?.alt ||
                                lightLogo.alt ||
                                'Logo'
                            }
                            width={140}
                            height={40}
                            className="block h-8 w-auto object-contain dark:hidden"
                        />
                    )}

                    {darkLogo?.url && (
                        <Image
                            src={darkLogo.url}
                            alt={
                                data.logo?.alt ||
                                darkLogo.alt ||
                                'Logo'
                            }
                            width={140}
                            height={40}
                            className="hidden h-8 w-auto object-contain dark:block"
                        />
                    )}
                </Link>

                <div className="ml-[42px] grid flex-1 grid-cols-[1fr_auto_1fr] items-center max-[900px]:hidden">
                    <div className="justify-self-start">
                        <Navigation items={left} />
                    </div>

                    <div className="justify-self-center">
                        <Navigation items={center} />
                    </div>

                    <div className="justify-self-end">
                        <Navigation items={right} />
                    </div>
                </div>

                <details className="relative ml-auto hidden max-[900px]:block">
                    <summary
                        aria-label="Open navigation"
                        className="flex h-[38px] w-[38px] cursor-pointer list-none flex-col items-center justify-center gap-[5px] rounded-[var(--style-radius-s)] border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-50)] [&::-webkit-details-marker]:hidden"
                    >
                        <span className="h-px w-[15px] bg-[var(--theme-elevation-700)]" />
                        <span className="h-px w-[15px] bg-[var(--theme-elevation-700)]" />
                    </summary>

                    <div className="absolute right-0 top-[calc(100%+1px)] w-screen max-w-[100vw] border-b border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-0)] px-5 py-3 max-[640px]:top-[calc(100%+1px)]">
                        <Navigation
                            items={navigation}
                            mobile
                        />
                    </div>
                </details>
            </div>
        </header>
    )
}