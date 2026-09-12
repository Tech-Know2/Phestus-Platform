import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
    slug: 'posts',
    access: {
        read: () => true,
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Post',
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
                            name: 'excerpt',
                            type: 'textarea',
                            admin: {
                                description: 'A short summary used on post listings and previews.',
                            },
                        },
                        {
                            name: 'featuredImage',
                            label: 'Featured Image',
                            type: 'upload',
                            relationTo: 'media',
                        },
                        {
                            name: 'content',
                            type: 'richText',
                            required: true,
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
                            name: 'publishedAt',
                            type: 'date',
                            admin: {
                                date: {
                                    pickerAppearance: 'dayAndTime',
                                },
                            },
                        },
                    ],
                },
                {
                    label: 'Organization',
                    fields: [
                        {
                            name: 'categories',
                            type: 'text',
                            hasMany: true,
                            admin: {
                                description: 'Categories such as Releases, Development, Guides, or Announcements.',
                            },
                        },
                        {
                            name: 'tags',
                            type: 'text',
                            hasMany: true,
                            admin: {
                                description: 'Add keywords that help organize and filter posts.',
                            },
                        },
                    ],
                },
            ],
        },
    ],
    timestamps: true,
}