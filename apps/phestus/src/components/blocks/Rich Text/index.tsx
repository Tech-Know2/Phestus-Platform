import { LexicalRichText } from '@/components/frontend/richtext/LexicalRichText';
import React from 'react'

type RichTextProps = {
  content?: unknown
}

export function RichText({ content }: RichTextProps) {
  if (!content) return null

  return (
    <section className="bg-[var(--theme-elevation-0)]">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
        <div className="rich-text">
          
        </div>
      </div>
    </section>
  )
}