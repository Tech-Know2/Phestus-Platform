import Link from 'next/link'

type ListingCardProps = {
    listing: any
}

export function ListingCard({ listing }: ListingCardProps) {
    const image =
        typeof listing.image === 'object'
            ? listing.image?.url
            : null

    return (
        <Link
            href={`/marketplace/${listing.slug}`}
            className="group block overflow-hidden rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-0)] transition hover:border-[var(--theme-elevation-250)] hover:shadow-[0_4px_16px_rgba(15,35,65,0.06)]"
        >
            {/* Image */}
            <div className="aspect-[4/3] overflow-hidden bg-[var(--theme-elevation-50)]">
                {image ? (
                    <img
                        src={image}
                        alt={listing.title ?? ''}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--theme-elevation-350)]">
                            No image
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                    <h2 className="line-clamp-2 text-[15px] font-semibold leading-5 tracking-[-0.01em] text-[var(--theme-elevation-850)] transition group-hover:text-[var(--theme-accent-600)]">
                        {listing.title}
                    </h2>

                    {listing.price != null && (
                        <span className="shrink-0 text-sm font-semibold text-[var(--theme-elevation-850)]">
                            ${listing.price}
                        </span>
                    )}
                </div>

                {listing.excerpt && (
                    <p className="line-clamp-2 text-sm leading-5 text-[var(--theme-elevation-500)]">
                        {listing.excerpt}
                    </p>
                )}

                <div className="mt-5 flex items-center justify-between border-t border-[var(--theme-elevation-100)] pt-4">
                    <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--theme-elevation-400)]">
                        {listing.category?.title ?? 'Listing'}
                    </span>

                    {listing.location && (
                        <span className="text-xs text-[var(--theme-elevation-500)]">
                            {listing.location}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}