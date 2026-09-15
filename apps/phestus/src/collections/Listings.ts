import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

export const Listings: CollectionConfig = {
    slug: 'listings',
    access: {
        read: () => true,
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'package', 'status', 'featured'],
        group: 'Phestus Marketplace'
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Identity',
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
                        },
                        {
                            name: 'package',
                            type: 'relationship',
                            relationTo: 'packages',
                            required: true,
                        },
                        {
                            name: 'publisher',
                            type: 'relationship',
                            relationTo: 'publishers',
                            required: true,
                        },
                    ],
                },
                {
                    label: 'Content',
                    fields: [
                        {
                            name: 'shortDescription',
                            type: 'textarea',
                        },
                        {
                            name: 'description',
                            type: 'richText',
                            editor: lexicalEditor(),
                        },
                        {
                            name: 'icon',
                            type: 'upload',
                            relationTo: 'media',
                        },
                        {
                            name: 'banner',
                            type: 'upload',
                            relationTo: 'media',
                        },
                        {
                            name: 'screenshots',
                            type: 'array',
                            fields: [
                                {
                                    name: 'image',
                                    type: 'upload',
                                    relationTo: 'media',
                                    required: true,
                                },
                            ],
                        },
                    ],
                },
                {
                    label: 'Marketplace',
                    fields: [
                        {
                            name: 'category',
                            type: 'text',
                        },
                        {
                            name: 'tags',
                            type: 'array',
                            fields: [
                                {
                                    name: 'tag',
                                    type: 'text',
                                    required: true,
                                },
                            ],
                        },
                        {
                            name: 'featured',
                            type: 'checkbox',
                            defaultValue: false,
                        },
                        {
                            name: 'verified',
                            type: 'checkbox',
                            defaultValue: false,
                        },
                        {
                            name: 'official',
                            type: 'checkbox',
                            defaultValue: false,
                        },
                        {
                            name: 'order',
                            type: 'number',
                        },
                    ],
                },
                {
                    label: 'Links',
                    fields: [
                        {
                            name: 'repositoryUrl',
                            type: 'text',
                        },
                        {
                            name: 'documentationUrl',
                            type: 'text',
                        },
                        {
                            name: 'supportUrl',
                            type: 'text',
                        },
                    ],
                },
                {
                    label: 'SEO',
                    fields: [
                        {
                            name: 'metaTitle',
                            type: 'text',
                        },
                        {
                            name: 'metaDescription',
                            type: 'textarea',
                        },
                        {
                            name: 'metaImage',
                            type: 'upload',
                            relationTo: 'media',
                        },
                    ],
                },
                {
                    label: 'Status',
                    fields: [
                        {
                            name: 'status',
                            type: 'select',
                            defaultValue: 'draft',
                            required: true,
                            options: [
                                { label: 'Draft', value: 'draft' },
                                { label: 'Review', value: 'review' },
                                { label: 'Published', value: 'published' },
                                { label: 'Hidden', value: 'hidden' },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    timestamps: true,
}