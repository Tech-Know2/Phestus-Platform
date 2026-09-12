import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Media } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { LexicalRichText } from '@/components/frontend/richtext/LexicalRichText';

export const dynamic = 'force-dynamic'

type Props = {
    params: Promise<{
        slug: string
    }>
}

export default async function PostPage({ params }: Props) {
    const { slug } = await params

    const payload = await getPayload({ config: configPromise })

    const { docs } = await payload.find({
        collection: 'posts',
        where: {
            and: [
                {
                    slug: {
                        equals: slug,
                    },
                },
                {
                    status: {
                        equals: 'published',
                    },
                },
            ],
        },
        depth: 1,
        limit: 1,
    })

    const post = docs[0]

    if (!post) {
        notFound()
    }

    const image =
        typeof post.featuredImage === 'object'
            ? (post.featuredImage as Media)
            : null

    return (
        <main className="min-h-screen bg-[var(--theme-elevation-0)] text-[var(--theme-elevation-800)]">
            <article>
                {/* Header */}
                <header className="border-b border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-50)]">
                    <div className="mx-auto max-w-4xl px-6 py-14 sm:px-8 sm:py-20">
                        <Link
                            href="/posts"
                            className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-[var(--theme-elevation-500)] transition-colors hover:text-[var(--theme-accent-600)]"
                        >
                            <span aria-hidden="true">←</span>
                            Back to posts
                        </Link>

                        {post.categories && post.categories.length > 0 && (
                            <div className="mb-5 flex flex-wrap gap-2">
                                {post.categories.map((category) => (
                                    <span
                                        key={category}
                                        className="rounded-full border border-[var(--theme-accent-200)] bg-[var(--theme-accent-50)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--theme-accent-700)]"
                                    >
                                        {category}
                                    </span>
                                ))}
                            </div>
                        )}

                        <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-[var(--theme-elevation-950)] sm:text-5xl lg:text-6xl">
                            {post.title}
                        </h1>

                        {post.excerpt && (
                            <p className="mt-6 max-w-3xl text-xl leading-8 text-[var(--theme-elevation-600)]">
                                {post.excerpt}
                            </p>
                        )}

                        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--theme-elevation-500)]">
                            {post.publishedAt && (
                                <time dateTime={post.publishedAt}>
                                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </time>
                            )}

                            {post.tags && post.tags.length > 0 && (
                                <>
                                    <span className="h-1 w-1 rounded-full bg-[var(--theme-elevation-300)]" />

                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map((tag) => (
                                            <span key={tag}>#{tag}</span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                {image?.url && (
                    <div className="mx-auto max-w-6xl px-6 pt-10 sm:px-8 lg:px-10">
                        <div className="overflow-hidden rounded-[var(--style-radius-l)] border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-50)] shadow-[0_1px_3px_rgba(15,35,65,0.05)]">
                            <img
                                src={image.url}
                                alt={image.alt || post.title}
                                className="max-h-[600px] w-full object-cover"
                            />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
                    <div className="prose prose-lg max-w-none">
                        <LexicalRichText data={post.content} />
                    </div>
                </div>

                {/* Footer */}
                <footer className="mx-auto max-w-3xl px-6 pb-16 sm:px-8">
                    <div className="border-t border-[var(--theme-elevation-150)] pt-8">
                        <Link
                            href="/posts"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--theme-accent-600)] transition-colors hover:text-[var(--theme-accent-700)]"
                        >
                            <span aria-hidden="true">←</span>
                            More posts
                        </Link>
                    </div>
                </footer>
            </article>
        </main>
    )
}