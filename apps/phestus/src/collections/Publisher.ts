import type { CollectionConfig } from 'payload'

export const Publishers: CollectionConfig = {
    slug: 'publishers',
    access: {
        read: () => true,
    },
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'type', 'verified', 'status'],
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
                            name: 'displayName',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'type',
                            type: 'select',
                            defaultValue: 'individual',
                            required: true,
                            options: [
                                { label: 'Individual', value: 'individual' },
                                { label: 'Organization', value: 'organization' },
                                { label: 'Official', value: 'official' },
                            ],
                        },
                    ],
                },
                {
                    label: 'Ownership',
                    fields: [
                        {
                            name: 'owner',
                            type: 'relationship',
                            relationTo: 'users',
                            required: true,
                        },
                        {
                            name: 'members',
                            type: 'array',
                            fields: [
                                {
                                    name: 'user',
                                    type: 'relationship',
                                    relationTo: 'users',
                                    required: true,
                                },
                                {
                                    name: 'role',
                                    type: 'select',
                                    defaultValue: 'developer',
                                    required: true,
                                    options: [
                                        { label: 'Owner', value: 'owner' },
                                        { label: 'Admin', value: 'admin' },
                                        { label: 'Maintainer', value: 'maintainer' },
                                        { label: 'Developer', value: 'developer' },
                                        { label: 'Viewer', value: 'viewer' },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    label: 'Profile',
                    fields: [
                        {
                            name: 'description',
                            type: 'textarea',
                        },
                        {
                            name: 'logo',
                            type: 'upload',
                            relationTo: 'media',
                        },
                        {
                            name: 'website',
                            type: 'text',
                        },
                        {
                            name: 'github',
                            type: 'text',
                        },
                        {
                            name: 'twitter',
                            type: 'text',
                        },
                    ],
                },
                {
                    label: 'Verification',
                    fields: [
                        {
                            name: 'verified',
                            type: 'checkbox',
                            defaultValue: false,
                        },
                        {
                            name: 'verifiedAt',
                            type: 'date',
                        },
                        {
                            name: 'verifiedBy',
                            type: 'relationship',
                            relationTo: 'users',
                        },
                    ],
                },
                {
                    label: 'Status',
                    fields: [
                        {
                            name: 'status',
                            type: 'select',
                            defaultValue: 'pending',
                            required: true,
                            options: [
                                { label: 'Pending', value: 'pending' },
                                { label: 'Active', value: 'active' },
                                { label: 'Suspended', value: 'suspended' },
                                { label: 'Disabled', value: 'disabled' },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    timestamps: true,
}