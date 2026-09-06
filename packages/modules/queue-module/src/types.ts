import type {
    PhestusProvider,
} from "@phestus/sdk";

export interface QueueMessage<T = unknown> {
    id: string;
    payload: T;
}

export interface QueueConsumeOptions {
    consumer?: string;
}

export interface TopicSubscribeOptions {
    subscriber: string;
}

export interface QueueProvider
    extends PhestusProvider {
    // --------------------------------------------------
    // Queue
    // --------------------------------------------------

    enqueue<T>(
        queueName: string,
        payload: T,
    ): Promise<void>;

    consume<T>(
        queueName: string,
        handler: (
            message: QueueMessage<T>,
        ) => Promise<void>,
        options?: QueueConsumeOptions,
    ): Promise<() => Promise<void>>;

    // --------------------------------------------------
    // Topic
    // --------------------------------------------------

    publish<T>(
        topic: string,
        payload: T,
    ): Promise<void>;

    subscribe<T>(
        topic: string,
        handler: (
            message: QueueMessage<T>,
        ) => Promise<void>,
        options: TopicSubscribeOptions,
    ): Promise<() => Promise<void>>;
}