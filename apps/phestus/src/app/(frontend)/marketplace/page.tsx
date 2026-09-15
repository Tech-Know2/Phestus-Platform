import { MarketplaceFilters } from '@/components/frontend/marketplace/MarketplaceFilters'
import { MarketplaceSearch } from '@/components/frontend/marketplace/MarketplaceSearch'
import { ListingCard } from '@/components/frontend/marketplace/ListingCard'
import { findAllListings } from '@/lib/marketplace/listing';

export default async function MarketplacePage() {
    const listings = await findAllListings()

    return (
        <main className="min-h-screen bg-[var(--theme-elevation-0)]">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                {/* Header */}
                <div className="mb-10">
                    <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--theme-accent-600)]">
                        Marketplace
                    </p>

                    <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--theme-elevation-900)] sm:text-4xl">
                        Explore listings
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--theme-elevation-600)]">
                        Discover modules, providers, plugins, packages, and services from countless publishers
                    </p>
                </div>

                {/* Search */}
                <MarketplaceSearch />

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
                    {/* Filters */}
                    <aside>
                        <MarketplaceFilters />
                    </aside>

                    {/* Listings */}
                    <section>
                        <div className="mb-5 flex items-center justify-between">
                            <p className="text-sm text-[var(--theme-elevation-600)]">
                                <span className="font-medium text-[var(--theme-elevation-800)]">
                                    {listings.length}
                                </span>{' '}
                                listings
                            </p>

                            <select
                                defaultValue="newest"
                                className="rounded-[var(--style-radius-s)] border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-0)] px-3 py-2 text-sm text-[var(--theme-elevation-700)] outline-none transition focus:border-[var(--theme-accent-500)]"
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="price-low">Price: Low to high</option>
                                <option value="price-high">Price: High to low</option>
                            </select>
                        </div>

                        {listings.length > 0 ? (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                {listings.map((listing) => (
                                    <ListingCard
                                        key={listing.id}
                                        listing={listing}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-50)] px-6 py-16 text-center">
                                <h2 className="text-sm font-semibold text-[var(--theme-elevation-800)]">
                                    No listings found
                                </h2>

                                <p className="mt-2 text-sm text-[var(--theme-elevation-500)]">
                                    Try adjusting your search or filters.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    )
}