import Link from 'next/link'
import type { Account } from '@/payload-types'

interface DashboardSidebarProps {
    user: Account
}

const navigation = [
    {
        label: 'Overview',
        href: '/dashboard',
        icon: (
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="6" height="6" rx="1" />
                <rect x="11" y="3" width="6" height="6" rx="1" />
                <rect x="3" y="11" width="6" height="6" rx="1" />
                <rect x="11" y="11" width="6" height="6" rx="1" />
            </svg>
        ),
    },
    {
        label: 'Projects',
        href: '/dashboard/projects',
        icon: (
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 6.5h5l1.5 2H17v7.5H3z" />
                <path d="M3 6.5V4h5l1.5 2.5" />
            </svg>
        ),
    },
    {
        label: 'Marketplace',
        href: '/dashboard/marketplace',
        icon: (
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 8h14l-1-4H4z" />
                <path d="M4 8v8h12V8" />
                <path d="M7 16v-4h6v4" />
            </svg>
        ),
    },
    {
        label: 'Settings',
        href: '/dashboard/settings',
        icon: (
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="10" cy="10" r="2.5" />
                <path d="M16.2 11.8a1.7 1.7 0 0 0 .34 1.87l.06.06-1.9 1.9-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V17h-2.7v-.21a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06-1.9-1.9.06-.06a1.7 1.7 0 0 0 .34-1.87A1.7 1.7 0 0 0 3.03 10H2.8V7.3h.23a1.7 1.7 0 0 0 1.56-1.03 1.7 1.7 0 0 0-.34-1.87l-.06-.06 1.9-1.9.06.06a1.7 1.7 0 0 0 1.87.34A1.7 1.7 0 0 0 9.05 1.3V1h2.7v.3a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06 1.9 1.9-.06.06a1.7 1.7 0 0 0-.34 1.87A1.7 1.7 0 0 0 17.77 7h.23v2.7h-.23a1.7 1.7 0 0 0-1.57 1.1z" />
            </svg>
        ),
    },
]

export default function DashboardSidebar({
    user,
}: DashboardSidebarProps) {
    const displayName =
        user.displayName || `${user.firstName} ${user.lastName}`

    return (
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-0)] lg:flex lg:flex-col">
            <div className="flex h-16 items-center border-b border-[var(--theme-elevation-150)] px-6">
                <Link
                    href="/dashboard"
                    className="font-[var(--font-body)] text-[18px] font-semibold tracking-[-0.03em] text-[var(--theme-elevation-950)] no-underline"
                >
                    Phestus
                </Link>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-5">
                {navigation.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex h-10 items-center gap-3 rounded-[var(--style-radius-s)] px-3 text-[13px] font-medium text-[var(--theme-elevation-600)] no-underline transition-colors hover:bg-[var(--theme-accent-50)] hover:text-[var(--theme-accent-700)]"
                    >
                        <span className="h-4 w-4">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="border-t border-[var(--theme-elevation-150)] p-3">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 rounded-[var(--style-radius-s)] p-2 no-underline transition-colors hover:bg-[var(--theme-elevation-50)]"
                >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--theme-accent-100)] text-[12px] font-semibold text-[var(--theme-accent-700)]">
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-[12px] font-medium text-[var(--theme-elevation-800)]">
                            {displayName}
                        </p>

                        <p className="truncate text-[11px] text-[var(--theme-elevation-500)]">
                            {user.email}
                        </p>
                    </div>
                </Link>
            </div>
        </aside>
    )
}