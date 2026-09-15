import type { CollectionConfig } from 'payload'

export const Namespaces: CollectionConfig = {
    slug: 'namespaces',
    access: {
        read: () => true,
    },
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'displayName', 'publisher', 'status'],
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
                            unique: true,
                        },
                        {
                            name: 'displayName',
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
                            name: 'type',
                            type: 'select',
                            defaultValue: 'individual',
                            required: true,
                            options: [
                                { label: 'Official', value: 'official' },
                                { label: 'Organization', value: 'organization' },
                                { label: 'Individual', value: 'individual' },
                            ],
                        },
                    ],
                },
                {
                    label: 'Ownership',
                    fields: [
                        {
                            name: 'publisher',
                            type: 'relationship',
                            relationTo: 'publishers',
                            required: true,
                        },
                    ],
                },
                {
                    label: 'Publishing',
                    fields: [
                        {
                            name: 'allowPublishing',
                            type: 'checkbox',
                            defaultValue: true,
                        },
                        {
                            name: 'requireApproval',
                            type: 'checkbox',
                            defaultValue: true,
                        },
                        {
                            name: 'packageLimit',
                            type: 'number',
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
                            defaultValue: 'active',
                            required: true,
                            options: [
                                { label: 'Active', value: 'active' },
                                { label: 'Suspended', value: 'suspended' },
                                { label: 'Reserved', value: 'reserved' },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    timestamps: true,
}