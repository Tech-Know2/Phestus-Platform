import type {
    QueueMessage,
    QueueProvider,
    QueueConsumeOptions,
    TopicSubscribeOptions
} from '@phestus/queue-module'
import { PhestusContext } from '@phestus/sdk';
import {
    Queue,
    Worker,
    type Job,
    type ConnectionOptions,
} from "bullmq";

import type {
    BullMQQueueProviderConfig,
} from "./types";

export class BullMQQueueProvider implements QueueProvider {
    slug = "bullmq"
    name = "BullMQ Queue Provider"
    module = "queue" as const

    private readonly connection: ConnectionOptions
    private readonly defaultJobOptions;

    private readonly queues = new Map<string, Queue>();
    private readonly workers = new Map<string, Worker>();

    constructor(
        config: BullMQQueueProviderConfig,
    ) {
        this.connection = config.connection;
        this.defaultJobOptions = config.defaultJobOptions;
    }

    async initialize(context: PhestusContext): Promise<void> {
        context.logger.info("BullMQ Queue Provider initialized")
    }

    async shutdown(context: PhestusContext): Promise<void> {
        await Promise.all(
            [...this.workers.values()].map(
                worker => worker.close(),
            ),
        );

        await Promise.all(
            [...this.queues.values()].map(
                queue => queue.close(),
            ),
        );

        this.workers.clear()
        this.queues.clear()

        context.logger.info("BullMQ Queue Provider shutdown");
    }

    async enqueue<T>(
        queueName: string,
        payload: T,
    ): Promise<void> {
        const queue = this.getQueue(queueName)

        await queue.add(
            queueName,
            payload,
            this.defaultJobOptions
        )
    }

    async consume<T>(
        queueName: string,
        handler: (
            message: QueueMessage<T>,
        ) => Promise<void>,
        options?: QueueConsumeOptions,
    ): Promise<() => Promise<void>> {
        const consumerName = options?.consumer ?? `phestus-${process.pid}-${queueName}`
        const workerKey = `${queueName}:${consumerName}`

        if (this.workers.has(workerKey)) {
            throw new Error(`A consumer already exists for ${workerKey}`)
        }

        const worker = new Worker<T>(
            queueName,
            async (job: Job<T>) => {
                await handler({
                    id: job.id!,
                    payload: job.data
                })
            }, {
            connection: this.connection,
            concurrency: 1,
            name: consumerName
        }
        )

        this.workers.set(
            workerKey,
            worker
        )

        return async () => {
            await worker.close()
            this.workers.delete(
                workerKey
            )
        }
    }

    async publish<T>(
        topic: string,
        payload: T,
    ): Promise<void> {
        const subscribers = this.getTopicSubscribers(topic)

        await Promise.all(
            subscribers.map(
                subscriber =>
                    this.enqueue(
                        subscriber.queueName,
                        payload
                    )
            )
        )
    }

    async subscribe<T>(
        topic: string,
        handler: (
            message: QueueMessage<T>,
        ) => Promise<void>,
        options: TopicSubscribeOptions,
    ): Promise<() => Promise<void>> {
        const queueName = this.getTopicQueueName(topic, options.subscriber);

        const unsubscribe =
            await this.consume<T>(
                queueName,
                handler,
                {
                    consumer: options.subscriber,
                },
            );

        this.registerTopicSubscriber(
            topic,
            options.subscriber,
            queueName,
        );

        return async () => {
            await unsubscribe();

            this.unregisterTopicSubscriber(
                topic,
                options.subscriber,
            );
        };
    }

    // --------------------------------------------------
    // Queue management
    // --------------------------------------------------

    private getQueue(
        queueName: string,
    ): Queue {

        const existing =
            this.queues.get(queueName);

        if (existing) {
            return existing;
        }

        const queue =
            new Queue(
                queueName,
                {
                    connection: this.connection,
                    defaultJobOptions: this.defaultJobOptions,
                },
            );

        this.queues.set(
            queueName,
            queue,
        );

        return queue;
    }


    // --------------------------------------------------
    // Topic management
    // --------------------------------------------------

    private readonly topicSubscribers =
        new Map<string, Map<string, { queueName: string }>>();

    private registerTopicSubscriber(
        topic: string,
        subscriber: string,
        queueName: string,
    ): void {

        let subscribers = this.topicSubscribers.get(topic);

        if (!subscribers) {
            subscribers = new Map();

            this.topicSubscribers.set(
                topic,
                subscribers,
            );
        }

        subscribers.set(
            subscriber,
            {
                queueName,
            },
        );
    }

    private unregisterTopicSubscriber(
        topic: string,
        subscriber: string,
    ): void {

        const subscribers =
            this.topicSubscribers.get(topic);

        if (!subscribers) {
            return;
        }

        subscribers.delete(
            subscriber,
        );

        if (subscribers.size === 0) {
            this.topicSubscribers.delete(
                topic,
            );
        }
    }

    private getTopicSubscribers(
        topic: string,
    ) {
        return [
            ...(this.topicSubscribers.get(topic)?.values() ?? []),
        ];
    }

    private getTopicQueueName(
        topic: string,
        subscriber: string,
    ): string {

        return `${topic}:${subscriber}`;
    }
}