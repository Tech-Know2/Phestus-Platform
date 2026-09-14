import { redirect } from 'next/navigation'
import { getUser } from '@/lib/ops/accounts'
import DashboardSidebar from './components/DashboardSidebar'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-[var(--theme-elevation-50)]">
            <DashboardSidebar user={user} />

            <div className="lg:pl-64">
                <main className="px-5 py-6 sm:px-8 lg:px-10">
                    <div className="mx-auto max-w-[1400px]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}