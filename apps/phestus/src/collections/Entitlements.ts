import type { CollectionConfig } from 'payload'

export const Entitlements: CollectionConfig = {
    slug: 'entitlements',
    access: {
        read: () => true,
    },
    admin: {
        useAsTitle: 'id',
        defaultColumns: ['user', 'package', 'source', 'status', 'expiresAt'],
        group: 'Phestus Marketplace'
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Ownership',
                    fields: [
                        {
                            name: 'user',
                            type: 'relationship',
                            relationTo: 'users',
                            required: true,
                        },
                        {
                            name: 'package',
                            type: 'relationship',
                            relationTo: 'packages',
                            required: true,
                        },
                        {
                            name: 'product',
                            type: 'relationship',
                            relationTo: 'products',
                        },
                    ],
                },
                {
                    label: 'Access',
                    fields: [
                        {
                            name: 'source',
                            type: 'select',
                            required: true,
                            options: [
                                { label: 'Purchase', value: 'purchase' },
                                { label: 'Subscription', value: 'subscription' },
                                { label: 'Free', value: 'free' },
                                { label: 'Bundle', value: 'bundle' },
                                { label: 'Admin', value: 'admin' },
                                { label: 'Developer', value: 'developer' },
                                { label: 'Promotion', value: 'promotion' },
                                { label: 'Trial', value: 'trial' },
                            ],
                        },
                        {
                            name: 'status',
                            type: 'select',
                            defaultValue: 'active',
                            required: true,
                            options: [
                                { label: 'Active', value: 'active' },
                                { label: 'Expired', value: 'expired' },
                                { label: 'Revoked', value: 'revoked' },
                                { label: 'Suspended', value: 'suspended' },
                            ],
                        },
                    ],
                },
                {
                    label: 'Dates',
                    fields: [
                        {
                            name: 'startsAt',
                            type: 'date',
                        },
                        {
                            name: 'expiresAt',
                            type: 'date',
                        },
                    ],
                },
                {
                    label: 'Commerce',
                    fields: [
                        {
                            name: 'transactionId',
                            type: 'text',
                        },
                    ],
                },
                {
                    label: 'Registry',
                    fields: [
                        {
                            name: 'registryAccess',
                            type: 'checkbox',
                            defaultValue: true,
                        },
                        {
                            name: 'lastRegistryAccess',
                            type: 'date',
                        },
                        {
                            name: 'registryAccessCount',
                            type: 'number',
                            defaultValue: 0,
                        },
                    ],
                },
            ],
        },
    ],
    timestamps: true,
}