import { redirect } from 'next/navigation'

import { getUser } from '@/lib/ops/accounts'
import CreateListing from '@/components/frontend/dashboard/create-listing'

export default async function CreateListingPage() {
    const user = await getUser()

    if (!user) {
        redirect('/login')
    }

    // Replace these with however your account/package/publisher
    // relationships are resolved.
    const packageId = ''
    const publisherId = ''

    return (
        <CreateListing
            packageId={packageId}
            publisherId={publisherId}
        />
    )
}