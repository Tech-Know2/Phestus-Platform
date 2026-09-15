'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useState } from 'react'

export function MarketplaceSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(
        searchParams.get('search') ?? '',
    )

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const params = new URLSearchParams(searchParams.toString())

        if (search.trim()) {
            params.set('search', search.trim())
        } else {
            params.delete('search')
        }

        router.push(`/marketplace?${params.toString()}`)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <svg
                        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-elevation-500)]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-4-4" />
                    </svg>

                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search listings..."
                        className="h-11 w-full rounded-[var(--style-radius-s)] border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-0)] pl-11 pr-4 text-sm text-[var(--theme-elevation-800)] outline-none transition placeholder:text-[var(--theme-elevation-400)] focus:border-[var(--theme-accent-500)] focus:ring-2 focus:ring-[var(--theme-accent-100)]"
                    />
                </div>

                <button
                    type="submit"
                    className="h-11 rounded-[var(--style-radius-s)] bg-[var(--theme-accent-600)] px-6 text-sm font-medium text-white transition hover:bg-[var(--theme-accent-700)]"
                >
                    Search
                </button>
            </div>
        </form>
    )
}