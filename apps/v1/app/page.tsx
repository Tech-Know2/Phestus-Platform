import Hero from '@/components/landing/hero'
import Stats from '@/components/landing/stats'
import Features from '@/components/landing/features'
import Architecture from '@/components/landing/architecture'
import Ecosystem from '@/components/landing/ecosystem'
import CTA from '@/components/landing/cta'

export default function HomePage() {
    return (
        <main className="bg-[var(--theme-elevation-0)] text-[var(--theme-elevation-800)]">
            <Hero />
            <Stats />
            <Features />
            <Architecture />
            <Ecosystem />
            <CTA />
        </main>
    )
}