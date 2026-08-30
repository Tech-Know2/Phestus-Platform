import type {
    PhestusContext,
    PhestusModule,
} from "@phestus/sdk";

import type {
    QueueProvider,
} from "./types";

export class QueueModule implements PhestusModule {
    manifest = {
        slug: "queue",
        name: "Queue Module",
        version: "0.1.0",
    };

    constructor(
        private readonly provider: QueueProvider,
    ) { }

    async initialize(
        context: PhestusContext,
    ): Promise<void> {
        await this.provider.initialize?.(
            context,
        );

        context.logger.info(
            "Queue Module initialized",
        );
    }

    async shutdown(
        context: PhestusContext,
    ): Promise<void> {
        await this.provider.shutdown?.(
            context,
        );

        context.logger.info(
            "Queue Module shutdown",
        );
    }


    // --------------------------------------------------
    // Queue
    // --------------------------------------------------

    async enqueue<T>(
        queue: string,
        payload: T,
    ): Promise<void> {
        await this.provider.enqueue(
            queue,
            payload,
        );
    }

    async consume<T>(
        queue: string,
        handler: (
            message: {
                id: string;
                payload: T;
            },
        ) => Promise<void>,
        options?: {
            consumer?: string;
        },
    ): Promise<() => Promise<void>> {
        return await this.provider.consume(
            queue,
            handler,
            options,
        );
    }

    async acknowledge(
        queue: string,
        messageId: string,
    ): Promise<void> {
        await this.provider.acknowledge(
            queue,
            messageId,
        );
    }

    async reject(
        queue: string,
        messageId: string,
        options?: {
            requeue?: boolean;
        },
    ): Promise<void> {
        await this.provider.reject(
            queue,
            messageId,
            options,
        );
    }


    // --------------------------------------------------
    // Topics
    // --------------------------------------------------

    async publish<T>(
        topic: string,
        payload: T,
    ): Promise<void> {
        await this.provider.publish(
            topic,
            payload,
        );
    }

    async subscribe<T>(
        topic: string,
        handler: (
            message: {
                id: string;
                payload: T;
            },
        ) => Promise<void>,
        options: {
            subscriber: string;
        },
    ): Promise<() => Promise<void>> {
        return await this.provider.subscribe(
            topic,
            handler,
            options,
        );
    }
}