import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { RenderBlocks } from '@/components/block-renderer'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      and: [
        {
          slug: {
            equals: '/home',
          },
        },
        {
          status: {
            equals: 'published',
          },
        },
      ],
    },
    limit: 1,
  })

  const page = docs[0]

  if (!page) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[var(--theme-elevation-0)] px-6">
        <div className="max-w-lg text-center">
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--theme-elevation-900)]">
            Home page not configured
          </h1>

          <p className="mt-3 text-[var(--theme-elevation-600)]">
            Create and publish a page with the slug{' '}
            <code className="rounded-[var(--style-radius-s)] bg-[var(--theme-elevation-100)] px-1.5 py-0.5 font-mono text-sm text-[var(--theme-elevation-800)]">
              /home
            </code>{' '}
            in the Payload admin panel to display your homepage.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[var(--theme-elevation-0)]">
      <RenderBlocks blocks={page.layout} />
    </main>
  )
}