import React from 'react'

type ImageBlockProps = {
    image?: {
        url?: string
        alt?: string
    } | null
    caption?: string
}

export function ImageBlock({ image, caption }: ImageBlockProps) {
    if (!image?.url) return null

    return (
        <section className="bg-[var(--theme-elevation-0)]">
            <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
                <figure>
                    <div className="overflow-hidden rounded-[var(--style-radius-l)] border border-[var(--theme-elevation-150)] bg-[var(--theme-elevation-50)]">
                        <img
                            src={image.url}
                            alt={image.alt || ''}
                            className="h-auto w-full object-cover"
                        />
                    </div>

                    {caption && (
                        <figcaption className="mt-3 text-center text-sm text-[var(--theme-elevation-500)]">
                            {caption}
                        </figcaption>
                    )}
                </figure>
            </div>
        </section>
    )
}