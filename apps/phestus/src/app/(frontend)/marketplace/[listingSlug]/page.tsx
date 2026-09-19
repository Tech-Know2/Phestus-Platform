import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Media } from '@/payload-types'
import { findListingBySlug } from '@/lib/marketplace/listing'
import ListingTabs from '@/components/frontend/marketplace/listing-tabs'

type PageProps = {
    params: Promise<{
        listingSlug: string
    }>
}

function getMediaUrl(media?: number | string | Media | null) {
    if (!media || typeof media === 'number') return null
    if (typeof media === 'string') return media

    return media.url ?? null
}

function getMediaAlt(media?: number | string | Media | null) {
    if (!media || typeof media === 'number' || typeof media === 'string') {
        return ''
    }

    return media.alt ?? ''
}

export default async function MarketplaceListingPage({
    params,
}: PageProps) {
    const { listingSlug } = await params

    const listing = await findListingBySlug(listingSlug)

    if (!listing) {
        notFound()
    }

    const iconUrl = getMediaUrl(listing.icon)
    const bannerUrl = getMediaUrl(listing.banner)

    return (
        <main className="min-h-screen bg-[var(--theme-elevation-0)]">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                {/* Breadcrumb */}
                <div className="mb-10 flex items-center gap-2 text-sm text-[var(--theme-elevation-500)]">
                    <Link
                        href="/marketplace"
                        className="transition-colors hover:text-[var(--theme-elevation-800)]"
                    >
                        Marketplace
                    </Link>

                    <span>/</span>

                    <span className="text-[var(--theme-elevation-700)]">
                        {listing.title}
                    </span>
                </div>

                {/* Header */}
                <section className="border-b border-[var(--theme-elevation-150)] pb-10">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex min-w-0 gap-5">
                            {iconUrl ? (
                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-50)]">
                                    <Image
                                        src={iconUrl}
                                        alt={getMediaAlt(listing.icon)}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-50)] text-2xl font-semibold text-[var(--theme-elevation-800)]">
                                    {listing.title.charAt(0)}
                                </div>
                            )}

                            <div className="min-w-0">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    {listing.official && (
                                        <span className="rounded-full border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-50)] px-2.5 py-1 text-xs font-medium text-[var(--theme-elevation-700)]">
                                            Official
                                        </span>
                                    )}

                                    {listing.verified && (
                                        <span className="rounded-full border border-[var(--theme-accent-500)]/30 bg-[var(--theme-accent-500)]/10 px-2.5 py-1 text-xs font-medium text-[var(--theme-accent-600)]">
                                            Verified
                                        </span>
                                    )}

                                    {listing.category && (
                                        <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--theme-accent-600)]">
                                            {listing.category}
                                        </span>
                                    )}
                                </div>

                                <h1 className="m-0 text-4xl font-semibold tracking-[-0.03em] text-[var(--theme-elevation-900)] sm:text-5xl">
                                    {listing.title}
                                </h1>

                                {listing.shortDescription && (
                                    <p className="mb-0 mt-4 max-w-2xl text-lg leading-8 text-[var(--theme-elevation-600)]">
                                        {listing.shortDescription}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action */}
                        <div className="shrink-0">
                            <button
                                type="button"
                                className="w-full rounded-[var(--style-radius-s)] bg-[var(--theme-accent-500)] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 lg:w-auto"
                            >
                                Get this package
                            </button>
                        </div>
                    </div>
                </section>

                {/* Banner */}
                {bannerUrl && (
                    <div className="mt-10 overflow-hidden rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-50)]">
                        <div className="relative aspect-[21/8] w-full">
                            <Image
                                src={bannerUrl}
                                alt={getMediaAlt(listing.banner)}
                                fill
                                priority
                                className="object-cover"
                            />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <ListingTabs listing={listing} />

                    {/* Sidebar */}
                    <aside className="h-fit lg:sticky lg:top-8">
                        <div className="rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-50)] p-5">
                            <p className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-[var(--theme-elevation-500)]">
                                Package
                            </p>

                            <h2 className="mb-5 text-lg font-semibold text-[var(--theme-elevation-900)]">
                                {listing.title}
                            </h2>

                            <button
                                type="button"
                                className="mb-5 w-full rounded-[var(--style-radius-s)] bg-[var(--theme-accent-500)] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                            >
                                Get this package
                            </button>

                            <div className="border-t border-[var(--theme-elevation-150)] pt-5">
                                <div className="space-y-4 text-sm">
                                    {listing.repositoryUrl && (
                                        <a
                                            href={listing.repositoryUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-between text-[var(--theme-elevation-600)] transition-colors hover:text-[var(--theme-elevation-900)]"
                                        >
                                            <span>Repository</span>
                                            <span>↗</span>
                                        </a>
                                    )}

                                    {listing.documentationUrl && (
                                        <a
                                            href={listing.documentationUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-between text-[var(--theme-elevation-600)] transition-colors hover:text-[var(--theme-elevation-900)]"
                                        >
                                            <span>Documentation</span>
                                            <span>↗</span>
                                        </a>
                                    )}

                                    {listing.supportUrl && (
                                        <a
                                            href={listing.supportUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-between text-[var(--theme-elevation-600)] transition-colors hover:text-[var(--theme-elevation-900)]"
                                        >
                                            <span>Support</span>
                                            <span>↗</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    )
}