import { QueueModule } from "@phestus/queue-module";
import { PhestusPlugin } from "@phestus/sdk";
import { BullMQQueueProvider, BullMQQueueProviderConfig } from "@phestus/bullmq"

export interface QueuePluginConfig {
    bullmq: BullMQQueueProviderConfig;
}

export class QueuePlugin implements PhestusPlugin {
    readonly manifest = {
        slug: 'queue-plugin',
        name: 'Queue Plugin',
        version: '0.1.0',
        provides: [
            {
                moduleSlug: 'queue',
                providerSlug: 'bullmq'
            },
        ],
        dependecies: [
            {
                type: "module",
                slug: 'queue',
                version: '0.1.0',
                optional: false,
            },
        ]
    }

    readonly modules = []
    readonly providers: BullMQQueueProvider[]

    constructor(config: QueuePluginConfig) {
        const provider = new BullMQQueueProvider(config.bullmq)

        this.providers = [
            provider
        ]
    }
}