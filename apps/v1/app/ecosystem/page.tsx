import {
    ecosystemData,
} from '@/lib/site-data'

import { PageHero } from '@/components/layout/PageHero'
import { ModuleSection } from '@/components/ecosystem/ModuleSection'
import { ProviderSection } from '@/components/ecosystem/ProviderSection'
import { ServiceAdapterSection } from '@/components/ecosystem/ServiceAdapterSection'

export default function EcosystemPage() {
    return (
        <>
            <PageHero data={ecosystemData.hero} />
            <ModuleSection modules={ecosystemData.modules} />
            <ProviderSection providers={ecosystemData.providers} />
            <ServiceAdapterSection adapters={ecosystemData.serviceAdapters} />
        </>
    )
}