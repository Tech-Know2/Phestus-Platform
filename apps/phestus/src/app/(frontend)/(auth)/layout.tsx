import Link from 'next/link'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="min-h-[calc(100vh-72px)] bg-[var(--theme-elevation-0)]">
            <div className="mx-auto flex min-h-[calc(100vh-72px)] w-[min(100%-40px,1200px)] items-center justify-center py-16 max-[640px]:w-[calc(100%-28px)] max-[640px]:py-12">
                <div className="w-full max-w-[440px]">
                    <Link
                        href="/"
                        className="mb-10 inline-flex items-center gap-2 text-[12px] font-medium text-[var(--theme-elevation-500)] no-underline transition-colors hover:text-[var(--theme-accent-600)]"
                    >
                        <svg
                            className="h-3.5 w-3.5"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            aria-hidden="true"
                        >
                            <path d="M13 8H3" />
                            <path d="m7 4-4 4 4 4" />
                        </svg>
                        Back to Phestus
                    </Link>

                    {children}
                </div>
            </div>
        </main>
    )
}