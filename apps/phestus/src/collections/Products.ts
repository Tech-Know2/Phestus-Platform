import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
    slug: 'products',
    access: {
        read: () => true,
    },
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'type', 'price', 'status'],
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
                            unique: true,
                        },
                        {
                            name: 'description',
                            type: 'richText',
                            editor: lexicalEditor(),
                        },
                        {
                            name: 'type',
                            type: 'select',
                            defaultValue: 'package',
                            required: true,
                            options: [
                                { label: 'Package', value: 'package' },
                                { label: 'Bundle', value: 'bundle' },
                                { label: 'Subscription', value: 'subscription' },
                                { label: 'License', value: 'license' },
                                { label: 'Other', value: 'other' },
                            ],
                        },
                    ],
                },
                {
                    label: 'Access',
                    fields: [
                        {
                            name: 'packages',
                            type: 'relationship',
                            relationTo: 'packages',
                            hasMany: true,
                            required: true,
                        },
                        {
                            name: 'accessType',
                            type: 'select',
                            defaultValue: 'permanent',
                            required: true,
                            options: [
                                { label: 'Permanent', value: 'permanent' },
                                { label: 'Subscription', value: 'subscription' },
                                { label: 'Time Limited', value: 'time-limited' },
                            ],
                        },
                    ],
                },
                {
                    label: 'Pricing',
                    fields: [
                        {
                            name: 'price',
                            type: 'number',
                            required: true,
                            min: 0,
                        },
                        {
                            name: 'currency',
                            type: 'text',
                            defaultValue: 'USD',
                            required: true,
                        },
                        {
                            name: 'billing',
                            type: 'select',
                            defaultValue: 'one_time',
                            required: true,
                            options: [
                                { label: 'Free', value: 'free' },
                                { label: 'One Time', value: 'one_time' },
                                { label: 'Monthly', value: 'monthly' },
                                { label: 'Yearly', value: 'yearly' },
                            ],
                        },
                    ],
                },
                {
                    label: 'Marketplace',
                    fields: [
                        {
                            name: 'listing',
                            type: 'relationship',
                            relationTo: 'listings',
                        },
                        {
                            name: 'featured',
                            type: 'checkbox',
                            defaultValue: false,
                        },
                    ],
                },
                {
                    label: 'Commerce',
                    fields: [
                        {
                            name: 'stripeProductId',
                            type: 'text',
                        },
                        {
                            name: 'stripePriceId',
                            type: 'text',
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
                                { label: 'Active', value: 'active' },
                                { label: 'Archived', value: 'archived' },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    timestamps: true,
}