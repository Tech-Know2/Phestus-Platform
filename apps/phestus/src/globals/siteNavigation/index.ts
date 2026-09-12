import type { GlobalConfig } from 'payload'

export const SiteNavigation: GlobalConfig = {
    slug: 'site-navigation',
    admin: {
        group: 'Site',
    },
    fields: [
        {
            name: 'header',
            type: 'group',
            fields: [
                {
                    name: 'logo',
                    type: 'group',
                    fields: [
                        {
                            name: 'light',
                            type: 'upload',
                            relationTo: 'media',
                        },
                        {
                            name: 'dark',
                            type: 'upload',
                            relationTo: 'media',
                        },
                        {
                            name: 'alt',
                            type: 'text',
                            defaultValue: 'Logo',
                        },
                    ],
                },
                {
                    name: 'navigation',
                    type: 'array',
                    admin: {
                        initCollapsed: true,
                    },
                    fields: [
                        {
                            name: 'label',
                            type: 'text',
                            required: true,
                        },

                        {
                            name: 'location',
                            type: 'select',
                            defaultValue: 'right',
                            options: [
                                {
                                    label: 'Left',
                                    value: 'left',
                                },
                                {
                                    label: 'Center',
                                    value: 'center',
                                },
                                {
                                    label: 'Right',
                                    value: 'right',
                                },
                            ],
                        },
                        {
                            name: 'link',
                            type: 'group',
                            fields: [
                                {
                                    name: 'type',
                                    type: 'radio',
                                    defaultValue: 'internal',
                                    options: [
                                        {
                                            label: 'Internal',
                                            value: 'internal',
                                        },
                                        {
                                            label: 'External',
                                            value: 'external',
                                        },
                                    ],
                                },
                                {
                                    name: 'reference',
                                    type: 'relationship',
                                    relationTo: ['pages', 'documentation', 'posts'],
                                    admin: {
                                        condition: (_, siblingData) =>
                                            siblingData?.type === 'internal',
                                    },
                                },
                                {
                                    name: 'url',
                                    type: 'text',
                                    admin: {
                                        condition: (_, siblingData) =>
                                            siblingData?.type === 'external',
                                    },
                                },
                                {
                                    name: 'newTab',
                                    type: 'checkbox',
                                    defaultValue: false,
                                },
                            ],
                        },
                        {
                            name: 'children',
                            type: 'array',
                            admin: {
                                initCollapsed: true,
                                description: 'Add child links to turn this item into a dropdown.',
                            },
                            fields: [
                                {
                                    name: 'label',
                                    type: 'text',
                                    required: true,
                                },
                                {
                                    name: 'description',
                                    type: 'text',
                                },
                                {
                                    name: 'link',
                                    type: 'group',
                                    fields: [
                                        {
                                            name: 'type',
                                            type: 'radio',
                                            defaultValue: 'internal',
                                            options: [
                                                {
                                                    label: 'Internal',
                                                    value: 'internal',
                                                },
                                                {
                                                    label: 'External',
                                                    value: 'external',
                                                },
                                            ],
                                        },
                                        {
                                            name: 'reference',
                                            type: 'relationship',
                                            relationTo: ['pages', 'posts', 'documentation'],
                                            admin: {
                                                condition: (_, siblingData) =>
                                                    siblingData?.type === 'internal',
                                            },
                                        },
                                        {
                                            name: 'url',
                                            type: 'text',
                                            admin: {
                                                condition: (_, siblingData) =>
                                                    siblingData?.type === 'external',
                                            },
                                        },
                                        {
                                            name: 'newTab',
                                            type: 'checkbox',
                                            defaultValue: false,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            name: 'footer',
            type: 'group',
            fields: [
                {
                    name: 'logo',
                    type: 'group',
                    fields: [
                        {
                            name: 'light',
                            type: 'upload',
                            relationTo: 'media',
                        },
                        {
                            name: 'dark',
                            type: 'upload',
                            relationTo: 'media',
                        },
                    ],
                },
                {
                    name: 'description',
                    type: 'textarea',
                },
                {
                    name: 'email',
                    type: 'email',
                },
                {
                    name: 'phone',
                    type: 'text',
                },
                {
                    name: 'columns',
                    type: 'array',
                    admin: {
                        initCollapsed: true,
                    },
                    fields: [
                        {
                            name: 'title',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'links',
                            type: 'array',
                            fields: [
                                {
                                    name: 'label',
                                    type: 'text',
                                    required: true,
                                },
                                {
                                    name: 'link',
                                    type: 'group',
                                    fields: [
                                        {
                                            name: 'type',
                                            type: 'radio',
                                            defaultValue: 'internal',
                                            options: [
                                                {
                                                    label: 'Internal',
                                                    value: 'internal',
                                                },
                                                {
                                                    label: 'External',
                                                    value: 'external',
                                                },
                                            ],
                                        },
                                        {
                                            name: 'reference',
                                            type: 'relationship',
                                            relationTo: ['pages', 'posts', 'documentation'],
                                            admin: {
                                                condition: (_, siblingData) =>
                                                    siblingData?.type === 'internal',
                                            },
                                        },
                                        {
                                            name: 'url',
                                            type: 'text',
                                            admin: {
                                                condition: (_, siblingData) =>
                                                    siblingData?.type === 'external',
                                            },
                                        },
                                        {
                                            name: 'newTab',
                                            type: 'checkbox',
                                            defaultValue: false,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    name: 'copyright',
                    type: 'text',
                },
            ],
        },
    ],
}