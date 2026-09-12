import { lexicalEditor } from '@payloadcms/richtext-lexical';
import type { CollectionConfig } from 'payload'

export const Documentation: CollectionConfig = {
  slug: 'documentation',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parent', 'status', 'updatedAt'],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Documentation',
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
              name: 'parent',
              type: 'relationship',
              relationTo: 'documentation',
              hasMany: false,
              admin: {
                description:
                  'Choose a parent document to create a nested documentation structure.',
              },
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
              name: 'order',
              type: 'number',
              required: true,
              defaultValue: 0,
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              editor: lexicalEditor({}),
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}