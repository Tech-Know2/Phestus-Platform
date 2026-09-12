import type { CollectionConfig } from 'payload'

import { Hero } from '@/blocks/Hero'
import { RichText } from '@/blocks/RichText'
import { ImageBlock } from '@/blocks/Image'
import { CallToAction } from '@/blocks/CTA'

export const Pages: CollectionConfig = {
    slug: 'pages',
    access: {
        read: () => true,
    },
    admin: {
        useAsTitle: 'title',
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Page',
                    fields: [
                        {
                            name: 'title',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'slug',
                            type: 'text',
                            required: true,
                            unique: true,
                            index: true,
                        },
                        {
                            name: 'status',
                            type: 'select',
                            required: true,
                            defaultValue: 'draft',
                            options: [
                                {
                                    label: 'Draft',
                                    value: 'draft',
                                },
                                {
                                    label: 'Published',
                                    value: 'published',
                                },
                            ],
                        },
                        {
                            name: 'layout',
                            type: 'blocks',
                            blocks: [
                                Hero,
                                RichText,
                                ImageBlock,
                                CallToAction,
                            ],
                        },
                    ],
                },
            ],
        },
    ],
}