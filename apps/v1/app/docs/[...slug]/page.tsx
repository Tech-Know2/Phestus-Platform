import { notFound } from 'next/navigation'

import {
    getDocumentation,
} from '@/lib/docs'

import { DocsBreadcrumbs } from '@/components/docs/DocsBreadcrumbs'
import { DocsNavigation } from '@/components/docs/DocsNavigation'
import { MarkdownContent } from '@/components/docs/MarkdownContent'

type Props = {
    params: Promise<{
        slug: string[]
    }>
}

export default async function DocumentationPage({ params }: Props) {
    const { slug } = await params
    const docSlug = slug.join('/')

    const doc = await getDocumentation(docSlug)

    if (!doc) {
        notFound()
    }

    return (
        <main className="w-full bg-[var(--theme-elevation-0)] font-[var(--font-body)] text-[var(--theme-elevation-800)]">
            <div className="mx-auto w-full max-w-[1440px] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
                <DocsBreadcrumbs doc={doc} />

                <div className="grid items-start gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[240px_minmax(0,760px)_200px] xl:gap-20">
                    <aside className="lg:sticky lg:top-8">
                        <DocsNavigation currentDoc={doc} />
                    </aside>

                    <article className="min-w-0">
                        <header className="mb-10 border-b border-[var(--theme-elevation-150)] pb-8">
                            <h1 className="text-4xl font-semibold tracking-[-0.035em] text-[var(--theme-elevation-900)] sm:text-5xl">
                                {doc.title}
                            </h1>
                        </header>

                        <div className="text-[16px] leading-7 text-[var(--theme-elevation-700)]">
                            <MarkdownContent content={doc.content} />
                        </div>
                    </article>

                    <aside className="hidden xl:sticky xl:top-8 xl:block">
                        <div className="border-l border-[var(--theme-elevation-150)] pl-5">
                            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--theme-elevation-500)]">
                                On this page
                            </span>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    )
}