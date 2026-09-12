import type { Block } from 'payload'

export const CallToAction: Block = {
    slug: 'callToAction',
    labels: {
        singular: 'Call to Action',
        plural: 'Calls to Action',
    },
    fields: [
        {
            name: 'heading',
            type: 'text',
            required: true,
        },
        {
            name: 'text',
            type: 'textarea',
        },
        {
            name: 'buttonLabel',
            type: 'text',
        },
        {
            name: 'buttonUrl',
            type: 'text',
        },
    ],
}