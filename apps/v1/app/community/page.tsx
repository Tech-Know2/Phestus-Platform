import {
    communityData,
} from '@/lib/site-data'

import { PageHero } from '@/components/layout/PageHero'
import { CommunityNotice } from '@/components/community/CommunityNotice'
import { InvolvementSection } from '@/components/community/InvolvementSection'
import { ProjectHighlights } from '@/components/community/ProjectHighlights'

export default function CommunityPage() {
    return (
        <>
            <PageHero data={communityData.hero} />
            <CommunityNotice
                title={communityData.notice.title}
                description={communityData.notice.description}
            />
            <InvolvementSection items={communityData.involvement} />
            <ProjectHighlights projects={communityData.projects} />
        </>
    )
}