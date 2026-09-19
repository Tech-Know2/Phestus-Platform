'use client'

import { useState } from 'react'
import Image from 'next/image'

import type { Listing, Media } from '@/payload-types'

type ListingTabsProps = {
    listing: Listing
}

type Tab = 'overview' | 'details' | 'screenshots' | 'publisher'

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

export default function ListingTabs({ listing }: ListingTabsProps) {
    const [activeTab, setActiveTab] = useState<Tab>('overview')

    const tabs: {
        id: Tab
        label: string
    }[] = [
            {
                id: 'overview',
                label: 'Overview',
            },
            {
                id: 'details',
                label: 'Details',
            },
            {
                id: 'screenshots',
                label: 'Screenshots',
            },
            {
                id: 'publisher',
                label: 'Publisher',
            },
        ]

    return (
        <div className="min-w-0">
            {/* Tabs */}
            <div className="mb-8 overflow-x-auto border-b border-[var(--theme-elevation-150)]">
                <nav className="flex min-w-max gap-7">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`border-b-2 px-0 pb-3 text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? 'border-[var(--theme-elevation-900)] text-[var(--theme-elevation-900)]'
                                    : 'border-transparent text-[var(--theme-elevation-700)] hover:text-[var(--theme-elevation-500)]'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Overview */}
            {activeTab === 'overview' && (
                <div>
                    <section>
                        <h2 className="mb-5 text-2xl font-semibold text-[var(--theme-elevation-900)]">
                            About this package
                        </h2>

                        {listing.description ? (
                            <div className="max-w-none text-[var(--theme-elevation-600)]">
                                {/* Replace with your Payload Lexical renderer */}
                                <p>
                                    This package is available through the
                                    Phestus Marketplace.
                                </p>
                            </div>
                        ) : (
                            <p className="text-[var(--theme-elevation-500)]">
                                No description has been provided.
                            </p>
                        )}
                    </section>

                    {listing.tags && listing.tags.length > 0 && (
                        <section className="mt-12">
                            <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.08em] text-[var(--theme-elevation-500)]">
                                Tags
                            </h2>

                            <div className="flex flex-wrap gap-2">
                                {listing.tags.map((item, index) => (
                                    <span
                                        key={`${item.tag}-${index}`}
                                        className="rounded-md border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-50)] px-3 py-1.5 text-sm text-[var(--theme-elevation-700)]"
                                    >
                                        {item.tag}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}

            {/* Details */}
            {activeTab === 'details' && (
                <section>
                    <h2 className="mb-6 text-2xl font-semibold text-[var(--theme-elevation-900)]">
                        Package details
                    </h2>

                    <div className="divide-y divide-[var(--theme-elevation-150)] rounded-xl border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-50)]">
                        {listing.category && (
                            <DetailRow
                                label="Category"
                                value={listing.category}
                            />
                        )}

                        {listing.repositoryUrl && (
                            <DetailLink
                                label="Repository"
                                href={listing.repositoryUrl}
                            />
                        )}

                        {listing.documentationUrl && (
                            <DetailLink
                                label="Documentation"
                                href={listing.documentationUrl}
                            />
                        )}

                        {listing.supportUrl && (
                            <DetailLink
                                label="Support"
                                href={listing.supportUrl}
                            />
                        )}

                        <DetailRow
                            label="Status"
                            value={listing.status}
                        />
                    </div>
                </section>
            )}

            {/* Screenshots */}
            {activeTab === 'screenshots' && (
                <section>
                    <h2 className="mb-6 text-2xl font-semibold text-[var(--theme-elevation-900)]">
                        Screenshots
                    </h2>

                    {listing.screenshots &&
                        listing.screenshots.length > 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2">
                            {listing.screenshots.map((screenshot, index) => {
                                const url = getMediaUrl(screenshot.image)

                                if (!url) return null

                                return (
                                    <div
                                        key={index}
                                        className="overflow-hidden rounded-xl border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-50)]"
                                    >
                                        <Image
                                            src={url}
                                            alt={getMediaAlt(
                                                screenshot.image,
                                            )}
                                            width={1200}
                                            height={800}
                                            className="h-auto w-full object-cover"
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-[var(--theme-elevation-200)] px-6 py-16 text-center">
                            <p className="m-0 text-[var(--theme-elevation-500)]">
                                No screenshots have been added yet.
                            </p>
                        </div>
                    )}
                </section>
            )}

            {/* Publisher */}
            {activeTab === 'publisher' && (
                <section>
                    <h2 className="mb-6 text-2xl font-semibold text-[var(--theme-elevation-900)]">
                        Publisher
                    </h2>

                    <div className="rounded-xl border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-50)] p-6">
                        <p className="m-0 text-[var(--theme-elevation-600)]">
                            Publisher information will appear here.
                        </p>
                    </div>
                </section>
            )}
        </div>
    )
}

function DetailRow({
    label,
    value,
}: {
    label: string
    value: string
}) {
    return (
        <div className="flex items-center justify-between gap-6 px-5 py-4">
            <span className="text-sm text-[var(--theme-elevation-500)]">
                {label}
            </span>

            <span className="text-right text-sm text-[var(--theme-elevation-800)]">
                {value}
            </span>
        </div>
    )
}

function DetailLink({
    label,
    href,
}: {
    label: string
    href: string
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-6 px-5 py-4 transition-colors hover:bg-[var(--theme-elevation-100)]"
        >
            <span className="text-sm text-[var(--theme-elevation-500)]">
                {label}
            </span>

            <span className="text-sm text-[var(--theme-elevation-800)]">
                Visit ↗
            </span>
        </a>
    )
}
