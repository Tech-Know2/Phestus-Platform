import { featuresData } from '@/lib/site-data'
import { PageHero } from '@/components/layout/PageHero'
import { FeatureGrid } from '@/components/features/FeatureGrid'

export default function FeaturesPage() {
    return (
        <>
            <PageHero data={featuresData.hero} />
            <FeatureGrid features={featuresData.features} />
        </>
    )
}