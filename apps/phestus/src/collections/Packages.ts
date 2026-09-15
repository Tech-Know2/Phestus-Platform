import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

export const Packages: CollectionConfig = {
    slug: 'packages',
    access: {
        read: () => true,
    },
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'slug', 'type', 'status'],
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
                            name: 'name',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'slug',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'namespace',
                            type: 'relationship',
                            relationTo: 'namespaces',
                            required: true,
                        },
                        {
                            name: 'publisher',
                            type: 'relationship',
                            relationTo: 'publishers',
                            required: true,
                        },
                        {
                            name: 'type',
                            type: 'select',
                            defaultValue: 'plugin',
                            required: true,
                            options: [
                                { label: 'Module', value: 'module' },
                                { label: 'Provider', value: 'provider' },
                                { label: 'Plugin', value: 'plugin' },
                                { label: 'Service', value: 'service' },
                                { label: 'Other', value: 'other' },
                            ],
                        },
                    ],
                },
                {
                    label: 'Information',
                    fields: [
                        {
                            name: 'description',
                            type: 'textarea',
                        },
                        {
                            name: 'readme',
                            type: 'richText',
                            editor: lexicalEditor(),
                        },
                        {
                            name: 'repository',
                            type: 'text',
                        },
                        {
                            name: 'homepage',
                            type: 'text',
                        },
                        {
                            name: 'documentationUrl',
                            type: 'text',
                        },
                        {
                            name: 'license',
                            type: 'text',
                        },
                        {
                            name: 'keywords',
                            type: 'array',
                            fields: [
                                {
                                    name: 'keyword',
                                    type: 'text',
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
                            name: 'visibility',
                            type: 'select',
                            defaultValue: 'public',
                            required: true,
                            options: [
                                { label: 'Public', value: 'public' },
                                { label: 'Unlisted', value: 'unlisted' },
                                { label: 'Private', value: 'private' },
                            ],
                        },
                        {
                            name: 'access',
                            type: 'select',
                            defaultValue: 'free',
                            required: true,
                            options: [
                                { label: 'Free', value: 'free' },
                                { label: 'Paid', value: 'paid' },
                                { label: 'Restricted', value: 'restricted' },
                            ],
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
                                { label: 'Pending Review', value: 'pending' },
                                { label: 'Published', value: 'published' },
                                { label: 'Suspended', value: 'suspended' },
                                { label: 'Deprecated', value: 'deprecated' },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    timestamps: true,
}