import type {
    QueueMessage,
    QueueProvider,
    QueueConsumeOptions,
    TopicSubscribeOptions
} from '@phestus/queue-module'
import { PhestusContext } from '@phestus/sdk';

export class BullMQQueueProvider implements QueueProvider {
    slug = "bullmq"
    name = "BullMQ Queue Provider"
    module = "queue" as const

    async initialize(context: PhestusContext): Promise<void> {

    }

    async shutdown(context: PhestusContext): Promise<void> {

    }

    async enqueue<T>(
        queue: string,
        payload: T,
    ): Promise<void> {
        // BullMQ Queue.add()
    }

    async consume<T>(
        queue: string,
        handler: (
            message: QueueMessage<T>,
        ) => Promise<void>,
        options?: QueueConsumeOptions,
    ): Promise<() => Promise<void>> {
        // BullMQ Worker
    }

    async acknowledge(
        queue: string,
        messageId: string,
    ): Promise<void> {
        // BullMQ semantics
    }

    async reject(
        queue: string,
        messageId: string,
        options?: {
            requeue?: boolean;
        },
    ): Promise<void> {
        // retry / failure semantics
    }

    async publish<T>(
        topic: string,
        payload: T,
    ): Promise<void> {
        // topic implementation
    }

    async subscribe<T>(
        topic: string,
        handler: (
            message: QueueMessage<T>,
        ) => Promise<void>,
        options: TopicSubscribeOptions,
    ): Promise<() => Promise<void>> {
        // topic subscription
    }
}