import { QueueModule } from "@phestus/queue-module";
import { PhestusPlugin } from "@phestus/sdk";

export class QueuePlugin implements PhestusPlugin {
    manifest: {
        slug: 'queue-plugin',
        name: 'Queue Plugin',
        version: '0.1.0',
        provides: [
            {
                module: 'queue',
                provider: 'bullmq'
            }
        ],
        dependecies: [
            {
                type: "module",
                slug: 'queue',
                version: '0.1.0',
                optional: false,
            }
        ]
    }

    modules: [
        QueueModule
    ]

    providers: [
        BullMQ
    ]
}