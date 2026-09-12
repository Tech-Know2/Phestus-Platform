import Link from 'next/link'
import type { Media } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export default async function PostsPage() {
    const payload = await getPayload({ config: configPromise })

    const { docs: posts } = await payload.find({
        collection: 'posts',
        where: {
            status: {
                equals: 'published',
            },
        },
        sort: '-publishedAt',
        depth: 1,
        limit: 100,
    })

    return (
        <main className="min-h-screen bg-[var(--theme-elevation-0)] text-[var(--theme-elevation-800)]">
            <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
                {/* Header */}
                <header className="mb-12 max-w-3xl">
                    <div className="mb-4 flex items-center gap-3">
                        <span className="h-px w-8 bg-[var(--theme-accent-500)]" />
                        <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--theme-accent-600)]">
                            Posts
                        </span>
                    </div>

                    <h1 className="text-4xl font-semibold tracking-[-0.035em] text-[var(--theme-elevation-900)] sm:text-5xl">
                        Thoughts, updates, and ideas.
                    </h1>

                    <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--theme-elevation-600)]">
                        Updates from the Phestus project, development notes, guides, and
                        ideas surrounding the platform.
                    </p>
                </header>

                {/* Posts */}
                {posts.length > 0 ? (
                    <div className="divide-y divide-[var(--theme-elevation-150)] border-y border-[var(--theme-elevation-150)]">
                        {posts.map((post) => {
                            const image =
                                typeof post.featuredImage === 'object'
                                    ? (post.featuredImage as Media)
                                    : null

                            return (
                                <article key={post.id} className="group py-8 sm:py-10">
                                    <Link
                                        href={`/posts/${post.slug}`}
                                        className="block rounded-[var(--style-radius-m)] outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--theme-accent-500)]"
                                    >
                                        <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
                                            <div>
                                                {/* Categories */}
                                                {post.categories && post.categories.length > 0 && (
                                                    <div className="mb-3 flex flex-wrap gap-2">
                                                        {post.categories.map((category) => (
                                                            <span
                                                                key={category}
                                                                className="rounded-full border border-[var(--theme-accent-200)] bg-[var(--theme-accent-50)] px-2.5 py-1 text-xs font-medium text-[var(--theme-accent-700)]"
                                                            >
                                                                {category}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[var(--theme-elevation-900)] transition-colors group-hover:text-[var(--theme-accent-600)] sm:text-3xl">
                                                    {post.title}
                                                </h2>

                                                {post.excerpt && (
                                                    <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--theme-elevation-600)]">
                                                        {post.excerpt}
                                                    </p>
                                                )}

                                                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--theme-elevation-500)]">
                                                    {post.publishedAt && (
                                                        <time dateTime={post.publishedAt}>
                                                            {new Date(post.publishedAt).toLocaleDateString(
                                                                'en-US',
                                                                {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                },
                                                            )}
                                                        </time>
                                                    )}

                                                    {post.tags && post.tags.length > 0 && (
                                                        <>
                                                            <span className="h-1 w-1 rounded-full bg-[var(--theme-elevation-300)]" />

                                                            <span>
                                                                {post.tags.slice(0, 3).join(' · ')}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Featured image */}
                                            {image?.url && (
                                                <div className="hidden h-28 w-44 overflow-hidden rounded-[var(--style-radius-m)] border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-50)] sm:block">
                                                    <img
                                                        src={image.url}
                                                        alt={image.alt || post.title}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[var(--theme-accent-600)]">
                                            Read post
                                            <span
                                                aria-hidden="true"
                                                className="transition-transform duration-200 group-hover:translate-x-1"
                                            >
                                                →
                                            </span>
                                        </div>
                                    </Link>
                                </article>
                            )
                        })}
                    </div>
                ) : (
                    <div className="rounded-[var(--style-radius-l)] border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-50)] px-6 py-16 text-center">
                        <h2 className="text-xl font-semibold text-[var(--theme-elevation-800)]">
                            No posts yet
                        </h2>

                        <p className="mt-2 text-[var(--theme-elevation-500)]">
                            Check back soon for new posts and updates.
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}