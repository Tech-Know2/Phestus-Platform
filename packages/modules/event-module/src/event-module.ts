import type {
    EventBus,
    EventHandler,
    PhestusEvent,
    PhestusModule,
    PhestusContext,
} from "@phestus/sdk";

import type {
    QueueModule,
} from "@phestus/queue-module";

export class EventModule
    implements PhestusModule, EventBus {

    manifest = {
        slug: "event",
        name: "Event Module",
        version: "0.1.0",
        dependencies: [
            {
                type: "module" as const,
                slug: "queue",
                version: "0.1.0",
                optional: false,
            },
        ],
    };

    private readonly subscriptions =
        new Map<
            string,
            Set<EventHandler>
        >();

    private readonly topic =
        "phestus:events";

    private unsubscribe?:
        () => Promise<void>;

    constructor(
        private readonly queue: QueueModule,
    ) { }

    async initialize(
        context: PhestusContext,
    ): Promise<void> {

        this.unsubscribe =
            await this.queue.subscribe<PhestusEvent>(
                this.topic,

                async (message) => {
                    await this.handleEvent(
                        message.payload,
                    );
                },

                {
                    subscriber: "event-module",
                },
            );

        context.logger.info(
            "Event Module initialized",
        );
    }

    async shutdown(
        context: PhestusContext,
    ): Promise<void> {

        if (this.unsubscribe) {
            await this.unsubscribe();

            this.unsubscribe = undefined;
        }

        context.logger.info(
            "Event Module shutdown",
        );
    }

    async emit<TData = unknown>(
        event: PhestusEvent<TData>,
    ): Promise<void> {

        await this.queue.publish(
            this.topic,
            event,
        );
    }

    async subscribe<TData = unknown>(
        type: string,
        handler: EventHandler<TData>,
    ): Promise<() => Promise<void>> {

        let handlers =
            this.subscriptions.get(type);

        if (!handlers) {
            handlers = new Set();

            this.subscriptions.set(
                type,
                handlers,
            );
        }

        handlers.add(handler);

        return async () => {
            handlers?.delete(handler);

            if (handlers?.size === 0) {
                this.subscriptions.delete(type);
            }
        };
    }

    private async handleEvent(
        event: PhestusEvent,
    ): Promise<void> {

        const handlers =
            this.subscriptions.get(
                event.type,
            );

        if (!handlers) {
            return;
        }

        await Promise.all(
            [...handlers].map(
                handler =>
                    handler.handle(event),
            ),
        );
    }
}