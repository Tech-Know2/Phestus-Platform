'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function MarketplaceFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [category, setCategory] = useState(
        searchParams.get('category') ?? '',
    )

    const [type, setType] = useState(
        searchParams.get('type') ?? '',
    )

    const [location, setLocation] = useState(
        searchParams.get('location') ?? '',
    )

    function updateFilter(
        key: string,
        value: string,
        setter: (value: string) => void,
    ) {
        setter(value)

        const params = new URLSearchParams(searchParams.toString())

        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }

        router.push(`/marketplace?${params.toString()}`)
    }

    function clearFilters() {
        setCategory('')
        setType('')
        setLocation('')

        const search = searchParams.get('search')
        const params = new URLSearchParams()

        if (search) {
            params.set('search', search)
        }

        router.push(`/marketplace?${params.toString()}`)
    }

    return (
        <div className="rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-0)] p-5">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[var(--theme-elevation-800)]">
                    Filters
                </h2>

                <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[11px] font-medium text-[var(--theme-accent-600)] transition hover:text-[var(--theme-accent-700)]"
                >
                    Clear
                </button>
            </div>

            <div className="space-y-6">
                <FilterField label="Category">
                    <select
                        value={category}
                        onChange={(event) =>
                            updateFilter(
                                'category',
                                event.target.value,
                                setCategory,
                            )
                        }
                        className="w-full rounded-[var(--style-radius-s)] border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-0)] px-3 py-2.5 text-sm text-[var(--theme-elevation-700)] outline-none focus:border-[var(--theme-accent-500)]"
                    >
                        <option value="">All categories</option>
                        <option value="software">Modules</option>
                        <option value="services">Providers</option>
                        <option value="design">Plugins</option>
                        <option value="services">Services</option>
                        <option value="other">Other</option>
                    </select>
                </FilterField>

                <FilterField label="Type">
                    <select
                        value={type}
                        onChange={(event) =>
                            updateFilter(
                                'type',
                                event.target.value,
                                setType,
                            )
                        }
                        className="w-full rounded-[var(--style-radius-s)] border border-[var(--theme-elevation-200)] bg-[var(--theme-elevation-0)] px-3 py-2.5 text-sm text-[var(--theme-elevation-700)] outline-none focus:border-[var(--theme-accent-500)]"
                    >
                        <option value="">All types</option>
                        <option value="software">Modules</option>
                        <option value="services">Providers</option>
                        <option value="design">Plugins</option>
                        <option value="services">Services</option>
                        <option value="other">Other</option>
                    </select>
                </FilterField>
            </div>
        </div>
    )
}

function FilterField({
    label,
    children,
}: {
    label: string
    children: React.ReactNode
}) {
    return (
        <div>
            <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--theme-elevation-500)]">
                {label}
            </label>

            {children}
        </div>
    )
}