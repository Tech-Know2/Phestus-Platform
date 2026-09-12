import type { Block } from 'payload'

export const Hero: Block = {
    slug: 'hero',
    labels: {
        singular: 'Hero',
        plural: 'Heroes',
    },
    fields: [
        {
            name: 'heading',
            type: 'text',
            required: true,
        },
        {
            name: 'subheading',
            type: 'textarea',
        },
        {
            name: 'link',
            type: 'group',
            fields: [
                {
                    name: 'label',
                    type: 'text',
                },
                {
                    name: 'url',
                    type: 'text',
                },
            ],
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
        },
    ],
}