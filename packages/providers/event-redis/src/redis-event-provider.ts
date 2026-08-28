import {
    createClient,
    type RedisClientType
} from 'redis'

import type {
    EventHandler,
    PhestusEvent
} from '@phestus/sdk'

import type {
    EventProvider
} from '@phestus/event-module'

import type {
    RedisEventProviderConfig
} from './types'

export class RedisEventProvider implements EventProvider {
    slug = 'redis'
    name = 'Redis Event Provider'
    module = "event" as const

    private readonly client: RedisClientType
    private readonly config: Required<RedisEventProviderConfig>

    private readonly handlers = new Map<string, Set<EventHandler>>
    private readonly subscriber: RedisClientType
    private consuming = false

    constructor(
        config: RedisEventProviderConfig
    ) {
        this.config = {
            stream: "phestus:events",
            consumerGroup: "phestus",
            consumerName: `phestus-${process.pid}`,
            ...config
        }

        this.client = createClient({
            url: this.config.url
        })

        this.subscriber = this.client.duplicate()
    }

    async initialize(): Promise<void> {
        await this.client.connect()
        await this.subscriber.connect()

        this.consuming = true

        await this.ensureConsumerGroup()

        this.consume()
    }

    async shutdown(): Promise<void> {
        this.consuming = false

        await this.subscriber.quit()
        await this.client.quit()
    }

    async emit<TData = unknown>(
        event: PhestusEvent<TData>
    ): Promise<void> {
        await this.client.xAdd(
            this.config.stream,
            "*",
            {
                event: JSON.stringify(event),
            }
        )
    }

    async subscribe<TData = unknown>(
        type: string,
        handler: EventHandler<TData>,
    ): Promise<() => Promise<void>> {
        let handlers = this.handlers.get(type)

        if (!handlers) {
            handlers = new Set()
            this.handlers.set(type, handlers)
        }

        handlers.add(handler)

        return async () => {
            handlers.delete(handler)

            if (handlers.size === 0) {
                this.handlers.delete(type)
            }
        }
    }

    private async ensureConsumerGroup(): Promise<void> {
        try {
            await this.subscriber.xGroupCreate(
                this.config.stream,
                this.config.consumerGroup,
                "0",
                {
                    MKSTREAM: true,
                }
            )
        } catch (error) {
            if (
                error instanceof Error &&
                error.message.includes("BUSYGROUP")
            ) {
                return
            }

            throw error
        }
    }

    private async consume(): Promise<void> {
        while (this.consuming) {
            try {
                const result = await this.subscriber.xReadGroup(
                    this.config.consumerGroup,
                    this.config.consumerName,
                    [
                        {
                            key: this.config.stream,
                            id: ">",
                        },
                    ],
                    {
                        COUNT: 10,
                        BLOCK: 5000,
                    }
                )

                if (!result) {
                    continue
                }

                for (const stream of result) {
                    for (const message of stream.messages) {
                        await this.handleMessage(message)
                    }
                }
            } catch (error) {
                if (!this.consuming) {
                    break
                }

                console.error(
                    "Redis event consumer error:",
                    error
                )
            }
        }
    }

    private async handleMessage(
        message: {
            id: string
            message: Record<string, string>
        }
    ): Promise<void> {
        const rawEvent = message.message.event

        if (!rawEvent) {
            return
        }

        const event = JSON.parse(
            rawEvent
        ) as PhestusEvent

        const handlers = this.handlers.get(
            event.type
        )

        if (!handlers) {
            await this.acknowledge(message.id)
            return
        }

        await Promise.all(
            [...handlers].map(handler =>
                handler.handle(event)
            )
        )

        await this.acknowledge(message.id)
    }

    private async acknowledge(
        messageId: string
    ): Promise<void> {
        await this.subscriber.xAck(
            this.config.stream,
            this.config.consumerGroup,
            messageId
        )
    }
}