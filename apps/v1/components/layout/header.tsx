import Link from 'next/link'

import { siteNavigation } from '@/lib/site-navigation'

function NavigationItems({
    position,
}: {
    position: 'left' | 'center' | 'right'
}) {
    return siteNavigation.header.navigation
        .filter((item) => item.position === position)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((item) => (
            <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[var(--theme-elevation-800)] transition-colors hover:text-[var(--theme-elevation-500)]"
            >
                {item.label}
            </Link>
        ))
}

export default function Header() {
    return (
        <header className="border-b border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-0)]">
            <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
                {/* Left */}
                <div className="flex flex-1 items-center gap-6">
                    <Link
                        href={siteNavigation.header.logo.href}
                        className="text-3xl font-semibold tracking-tight text-[var(--theme-elevation-900)]"
                    >
                        {siteNavigation.header.logo.label}
                    </Link>

                    <nav className="hidden items-center gap-5 md:flex">
                        <NavigationItems position="left" />
                    </nav>
                </div>

                {/* Center */}
                <nav className="hidden items-center gap-5 md:flex">
                    <NavigationItems position="center" />
                </nav>

                {/* Right */}
                <div className="flex flex-1 items-center justify-end gap-5">
                    <nav className="hidden items-center gap-5 md:flex">
                        <NavigationItems position="right" />
                    </nav>

                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-[var(--style-radius-s)] border border-[var(--theme-elevation-200)] text-[var(--theme-elevation-700)] transition-colors hover:bg-[var(--theme-elevation-50)] md:hidden"
                        aria-label="Open navigation"
                    >
                        <span className="text-lg">☰</span>
                    </button>
                </div>
            </div>
        </header>
    )
}