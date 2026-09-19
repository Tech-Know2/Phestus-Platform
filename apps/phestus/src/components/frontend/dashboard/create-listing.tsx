'use client'

import { useState } from 'react'
import { createListing } from '@/lib/marketplace/listing'

type CreateListingProps = {
    packageId: string
    publisherId: string
}

export default function CreateListing({
    packageId,
    publisherId,
}: CreateListingProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [shortDescription, setShortDescription] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [tags, setTags] = useState('')
    const [repositoryUrl, setRepositoryUrl] = useState('')
    const [documentationUrl, setDocumentationUrl] = useState('')
    const [supportUrl, setSupportUrl] = useState('')

    function handleTitleChange(value: string) {
        setTitle(value)

        if (!slug) {
            setSlug(
                value
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, ''),
            )
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setIsSubmitting(true)
        setError(null)
        setSuccess(false)

        try {
            await createListing(
                {
                    title,
                    slug,
                    shortDescription: shortDescription || undefined,
                    description: description
                        ? {
                            root: {
                                type: 'root',
                                version: 1,
                                children: [
                                    {
                                        type: 'paragraph',
                                        version: 1,
                                        children: [
                                            {
                                                type: 'text',
                                                text: description,
                                                version: 1,
                                            },
                                        ],
                                    },
                                ],
                                direction: null,
                                format: '',
                                indent: 0,
                            },
                        }
                        : undefined,
                    category: category || undefined,
                    tags: tags
                        ? tags
                            .split(',')
                            .map((tag) => tag.trim())
                            .filter(Boolean)
                            .map((tag) => ({ tag }))
                        : undefined,
                    repositoryUrl: repositoryUrl || undefined,
                    documentationUrl: documentationUrl || undefined,
                    supportUrl: supportUrl || undefined,
                },
                packageId,
                publisherId,
            )

            setSuccess(true)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Something went wrong while creating the listing.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-10">
                <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--theme-accent-600)]">
                    Marketplace
                </p>

                <h1 className="m-0 text-3xl font-semibold tracking-tight text-[var(--theme-text)]">
                    Create a listing
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--theme-text-dim)]">
                    Publish your package to the Phestus Marketplace. Your
                    listing will be created as a draft and can be reviewed
                    before publication.
                </p>
            </div>

            {error && (
                <div className="mb-6 rounded-lg border border-[var(--theme-error-500)]/30 bg-[var(--theme-error-500)]/10 px-4 py-3 text-sm text-[var(--theme-error-500)]">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 rounded-lg border border-[var(--theme-success-500)]/30 bg-[var(--theme-success-500)]/10 px-4 py-3 text-sm text-[var(--theme-success-500)]">
                    Your listing has been created as a draft.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Identity */}
                <section className="rounded-xl border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-0)]">
                    <div className="border-b border-[var(--theme-elevation-150)] px-6 py-5">
                        <h2 className="m-0 text-base font-semibold text-[var(--theme-text)]">
                            Identity
                        </h2>

                        <p className="mt-1 text-sm text-[var(--theme-text-dim)]">
                            Basic information about your package.
                        </p>
                    </div>

                    <div className="grid gap-6 p-6 sm:grid-cols-2">
                        <Field
                            label="Title"
                            required
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Redis Event Provider"
                        />

                        <Field
                            label="Slug"
                            required
                            value={slug}
                            onChange={setSlug}
                            placeholder="redis-event-provider"
                        />

                        <div className="sm:col-span-2">
                            <Field
                                label="Short description"
                                value={shortDescription}
                                onChange={setShortDescription}
                                placeholder="A Redis-backed event provider for Phestus."
                            />
                        </div>

                        <Field
                            label="Category"
                            value={category}
                            onChange={setCategory}
                            placeholder="Providers"
                        />

                        <Field
                            label="Tags"
                            value={tags}
                            onChange={setTags}
                            placeholder="redis, events, provider"
                            description="Separate tags with commas."
                        />
                    </div>
                </section>

                {/* Description */}
                <section className="rounded-xl border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-0)]">
                    <div className="border-b border-[var(--theme-elevation-150)] px-6 py-5">
                        <h2 className="m-0 text-base font-semibold text-[var(--theme-text)]">
                            Description
                        </h2>

                        <p className="mt-1 text-sm text-[var(--theme-text-dim)]">
                            Explain what your package does and how users can
                            use it.
                        </p>
                    </div>

                    <div className="p-6">
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-[var(--theme-text)]">
                                Description
                            </span>

                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                rows={10}
                                placeholder="Describe your package..."
                                className="w-full resize-y rounded-lg border border-[var(--theme-elevation-250)] bg-[var(--theme-elevation-50)] px-3 py-2.5 text-sm text-[var(--theme-text)] outline-none transition-colors placeholder:text-[var(--theme-text-dim)] focus:border-[var(--theme-accent-500)]"
                            />
                        </label>
                    </div>
                </section>

                {/* Links */}
                <section className="rounded-xl border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-0)]">
                    <div className="border-b border-[var(--theme-elevation-150)] px-6 py-5">
                        <h2 className="m-0 text-base font-semibold text-[var(--theme-text)]">
                            Links
                        </h2>

                        <p className="mt-1 text-sm text-[var(--theme-text-dim)]">
                            Help users find your source code and documentation.
                        </p>
                    </div>

                    <div className="grid gap-6 p-6">
                        <Field
                            label="Repository URL"
                            value={repositoryUrl}
                            onChange={setRepositoryUrl}
                            placeholder="https://github.com/..."
                        />

                        <Field
                            label="Documentation URL"
                            value={documentationUrl}
                            onChange={setDocumentationUrl}
                            placeholder="https://docs.example.com/..."
                        />

                        <Field
                            label="Support URL"
                            value={supportUrl}
                            onChange={setSupportUrl}
                            placeholder="https://github.com/.../issues"
                        />
                    </div>
                </section>

                {/* Submit */}
                <div className="flex items-center justify-between gap-4 border-t border-[var(--theme-elevation-150)] pt-6">
                    <p className="m-0 text-sm text-[var(--theme-text-dim)]">
                        Your listing will initially be saved as a draft.
                    </p>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-[var(--theme-accent-500)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? 'Creating...' : 'Create listing'}
                    </button>
                </div>
            </form>
        </div>
    )
}

function Field({
    label,
    value,
    onChange,
    placeholder,
    required = false,
    description,
}: {
    label: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    required?: boolean
    description?: string
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--theme-text)]">
                {label}
                {required && (
                    <span className="ml-1 text-[var(--theme-error-500)]">
                        *
                    </span>
                )}
            </span>

            <input
                type="text"
                value={value}
                required={required}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border border-[var(--theme-elevation-250)] bg-[var(--theme-elevation-50)] px-3 py-2.5 text-sm text-[var(--theme-text)] outline-none transition-colors placeholder:text-[var(--theme-text-dim)] focus:border-[var(--theme-accent-500)]"
            />

            {description && (
                <span className="mt-1.5 block text-xs text-[var(--theme-text-dim)]">
                    {description}
                </span>
            )}
        </label>
    )
}