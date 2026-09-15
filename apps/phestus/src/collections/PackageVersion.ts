import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

export const PackageVersions: CollectionConfig = {
    slug: 'package-versions',
    access: {
        read: () => true,
    },
    admin: {
        useAsTitle: 'version',
        defaultColumns: ['package', 'version', 'status', 'publishedAt'],
        group: 'Phestus Marketplace'
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Version',
                    fields: [
                        {
                            name: 'package',
                            type: 'relationship',
                            relationTo: 'packages',
                            required: true,
                        },
                        {
                            name: 'version',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'status',
                            type: 'select',
                            defaultValue: 'draft',
                            required: true,
                            options: [
                                { label: 'Draft', value: 'draft' },
                                { label: 'Pending Review', value: 'pending' },
                                { label: 'Published', value: 'published' },
                                { label: 'Deprecated', value: 'deprecated' },
                                { label: 'Yanked', value: 'yanked' },
                            ],
                        },
                    ],
                },
                {
                    label: 'Package Data',
                    fields: [
                        {
                            name: 'dependencies',
                            type: 'json',
                        },
                        {
                            name: 'peerDependencies',
                            type: 'json',
                        },
                        {
                            name: 'optionalDependencies',
                            type: 'json',
                        },
                        {
                            name: 'engines',
                            type: 'json',
                        },
                        {
                            name: 'packageJson',
                            type: 'json',
                        },
                    ],
                },
                {
                    label: 'Distribution',
                    fields: [
                        {
                            name: 'tarball',
                            type: 'upload',
                            relationTo: 'media',
                        },
                        {
                            name: 'integrity',
                            type: 'text',
                        },
                        {
                            name: 'shasum',
                            type: 'text',
                        },
                        {
                            name: 'size',
                            type: 'number',
                        },
                    ],
                },
                {
                    label: 'Release',
                    fields: [
                        {
                            name: 'changelog',
                            type: 'richText',
                            editor: lexicalEditor(),
                        },
                        {
                            name: 'releaseNotes',
                            type: 'richText',
                            editor: lexicalEditor(),
                        },
                        {
                            name: 'publishedAt',
                            type: 'date',
                        },
                        {
                            name: 'publishedBy',
                            type: 'relationship',
                            relationTo: 'publishers',
                        },
                    ],
                },
                {
                    label: 'Registry',
                    fields: [
                        {
                            name: 'registryPublished',
                            type: 'checkbox',
                            defaultValue: false,
                        },
                        {
                            name: 'registryPackageName',
                            type: 'text',
                        },
                    ],
                },
            ],
        },
    ],
    timestamps: true,
}