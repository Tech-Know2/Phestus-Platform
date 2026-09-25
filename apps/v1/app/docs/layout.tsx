import { getDocumentationSearchIndex } from '@/lib/docs'
import { DocsSearch } from '@/components/docs/search/DocSearch'

export default async function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const documents = await getDocumentationSearchIndex()

    return (
        <div className="relative min-h-screen">
            <DocsSearch documents={documents} />

            {children}
        </div>
    )
}