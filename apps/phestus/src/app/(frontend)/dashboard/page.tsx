import { getUser } from '@/lib/ops/accounts'

export default async function DashboardPage() {
    const user = await getUser()

    return (
        <div>
            <div className="mb-8">
                <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--theme-accent-600)]">
                    Overview
                </p>

                <h1 className="m-0 font-[var(--font-body)] text-[36px] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--theme-elevation-950)]">
                    Welcome, {user?.firstName}.
                </h1>

                <p className="mt-4 max-w-[620px] text-[14px] leading-[1.7] text-[var(--theme-elevation-550)]">
                    Manage your Phestus projects, account, and marketplace
                    activity from one place.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-0)] p-5">
                    <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--theme-elevation-500)]">
                        Projects
                    </p>

                    <p className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-[var(--theme-elevation-950)]">
                        0
                    </p>

                    <p className="mt-1 text-[12px] text-[var(--theme-elevation-500)]">
                        Active projects
                    </p>
                </div>

                {user?.isSeller && (
                    <div className="rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-0)] p-5">
                        <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--theme-elevation-500)]">
                            Marketplace
                        </p>

                        <p className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-[var(--theme-elevation-950)]">
                            0
                        </p>

                        <p className="mt-1 text-[12px] text-[var(--theme-elevation-500)]">
                            Listings
                        </p>
                    </div>
                )}

                <div className="rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-0)] p-5">
                    <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--theme-elevation-500)]">
                        Account
                    </p>

                    <p className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-[var(--theme-elevation-950)]">
                        {user?.status}
                    </p>

                    <p className="mt-1 text-[12px] text-[var(--theme-elevation-500)]">
                        Account status
                    </p>
                </div>
            </div>
        </div>
    )
}