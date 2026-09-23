export const ecosystemData = {
    hero: {
        eyebrow: 'Ecosystem',
        title: 'Build with the Phestus ecosystem.',
        description:
            'Phestus is designed around modular capabilities, interchangeable providers, and service adapters that let you build the stack your project needs.',
    },
    modules: [
        {
            name: 'Event',
            slug: 'event',
            description: 'Provides an event bus for publishing and subscribing to application events.',
        },
        {
            name: 'Queue',
            slug: 'queue',
            description: 'Defines queue capabilities for processing asynchronous work.',
        },
        {
            name: 'Job',
            slug: 'job',
            description: 'Provides a foundation for defining and executing background jobs.',
        },
        {
            name: 'Workflow',
            slug: 'workflow',
            description: 'Connects events, jobs, and queues into reusable workflows.',
        },
        {
            name: 'Auth',
            slug: 'auth',
            description: 'Provides auth and access control capabilities for applications.',
        },
        {
            name: 'API',
            slug: 'api',
            description: 'Provides the ability to define, manage, and curate the creation of an API interface and handler.'
        },
    ],
    providers: [
        {
            name: 'BullMQ',
            slug: 'bullmq',
            module: 'Queue',
            description: 'A BullMQ-backed implementation of the Phestus Queue module.',
        },
        {
            name: 'Redis Events',
            slug: 'event-redis',
            module: 'Event',
            description: 'A Redis Streams implementation of the Phestus Event module.',
        },
    ],
    serviceAdapters: [
        {
            name: 'Payload CMS',
            slug: 'payload',
            description: 'Use Payload CMS as the application service layer for Phestus.',
        },
        {
            name: 'Sanity',
            slug: 'sanity',
            description: 'Connect Phestus to Sanity as a content and data service.',
        },
        {
            name: 'Custom Service',
            slug: 'custom',
            description: 'Build your own service adapter around the systems your application already uses.',
        },
    ],
}

export const communityData = {
    hero: {
        eyebrow: 'Community',
        title: 'Build with us.',
        description: 'Phestus is an evolving open platform. Explore the project, contribute ideas, build integrations, and share what you create.',
    },
    notice: {
        title: 'Built with the assistance of AI',
        description: 'Phestus has been developed with the assistance of artificial intelligence throughout its design, development, documentation, and experimentation. AI is treated as a development tool alongside traditional engineering practices.',
    },
    involvement: [
        {
            title: 'Build',
            description: 'Create modules, providers, plugins, and service adapters that extend the Phestus ecosystem.',
        },
        {
            title: 'Contribute',
            description: 'Help improve the core platform, documentation, examples, and developer experience.',
        },
        {
            title: 'Share',
            description: 'Show the community what you are building with Phestus and share your experience.',
        },
    ],
    projects: [
        /*{
            name: 'Project Alpha',
            description: 'A custom application built around Phestus modules and a Payload CMS service adapter.',
            author: 'Community',
            tags: ['Payload CMS', 'Phestus'],
            href: '#',
        },
        {
            name: 'Project Beta',
            description: 'An event-driven application using Redis events and BullMQ queues.',
            author: 'Community',
            tags: ['Redis', 'BullMQ', 'Events'],
            href: '#',
        },
        {
            name: 'Project Gamma',
            description: 'A custom Phestus service adapter connecting an existing application stack.',
            author: 'Community',
            tags: ['Service Adapter'],
            href: '#',
        },*/
    ],
}

export const featuresData = {
    hero: {
        eyebrow: 'Features',
        title: 'A web stack built around composition.',
        description:
            'Phestus gives applications a common runtime and a collection of modular building blocks that can be combined, replaced, and extended.',
    },

    features: [
        {
            title: 'Modular Architecture',
            description:
                'Add capabilities through independent modules instead of coupling your application to a single implementation.',
        },
        {
            title: 'Provider System',
            description:
                'Swap implementations without changing the module API your application depends on.',
        },
        {
            title: 'Service Adapters',
            description:
                'Connect Phestus to Payload CMS, Sanity, or your own application service.',
        },
        {
            title: 'Event Driven',
            description:
                'Publish and consume events throughout your application using a consistent event bus.',
        },
        {
            title: 'Background Jobs',
            description:
                'Move asynchronous work out of your request path with queues and jobs.',
        },
        {
            title: 'Workflows',
            description:
                'Compose events, jobs, and other capabilities into reusable application workflows.',
        },
        {
            title: 'Plugin Architecture',
            description:
                'Package modules and providers together into installable plugins.',
        },
        {
            title: 'Developer First',
            description:
                'Keep the core runtime small and give developers control over the technologies behind it.',
        },
    ],
}