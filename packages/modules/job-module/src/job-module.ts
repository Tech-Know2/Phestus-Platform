import type {
    PhestusContext,
    PhestusModule,
} from "@phestus/sdk";

import { QueueModule } from "@phestus/queue-module";

import type {
    Job,
    JobHandler,
} from "./types";

export class JobModule implements PhestusModule {
    manifest = {
        slug: "job",
        name: "Job Module",
        version: "0.1.0",
        dependencies: [
            {
                slug: "queue",
                version: "0.1.0",
            },
        ],
    };

    private readonly handlers = new Map<string, JobHandler>();
    private readonly consumers = new Map<string, () => Promise<void>>();
    private context?: PhestusContext;
    private initialized = false;

    constructor(
        private readonly queue: QueueModule,
    ) { }

    // --------------------------------------------------
    // Lifecycle
    // --------------------------------------------------

    async initialize(
        context: PhestusContext,
    ): Promise<void> {

        this.context = context;
        this.initialized = true;

        for (const name of this.handlers.keys()) {
            await this.startConsumer(name);
        }

        context.logger.info("Job Module initialized");
    }

    async shutdown(
        context: PhestusContext,
    ): Promise<void> {

        await Promise.all(
            [...this.consumers.values()].map(
                unsubscribe => unsubscribe(),
            ),
        );

        this.consumers.clear();
        this.handlers.clear();

        this.initialized = false;
        this.context = undefined;

        context.logger.info(
            "Job Module shutdown",
        );
    }

    // --------------------------------------------------
    // Registration
    // --------------------------------------------------

    register<T>(
        name: string,
        handler: JobHandler<T>,
    ): void {

        if (this.handlers.has(name)) {
            throw new Error(`Job handler already registered: ${name}`);
        }

        this.handlers.set(
            name,
            handler as JobHandler,
        );

        if (this.initialized) {
            void this.startConsumer(name);
        }
    }

    // --------------------------------------------------
    // Dispatch
    // --------------------------------------------------

    async dispatch<T>(
        job: Job<T>,
    ): Promise<void> {

        if (!this.handlers.has(job.name)) {
            throw new Error(`No handler registered for job: ${job.name}`);
        }

        await this.queue.enqueue(
            this.getQueueName(job.name),
            job,
        );
    }

    // --------------------------------------------------
    // Consumers
    // --------------------------------------------------

    private async startConsumer(
        name: string,
    ): Promise<void> {

        if (this.consumers.has(name)) {
            return;
        }

        if (!this.context) {
            throw new Error("Job Module has not been initialized");
        }

        const unsubscribe =
            await this.queue.consume<Job>(
                this.getQueueName(name),

                async message => {
                    const job = message.payload;

                    const handler = this.handlers.get(job.name);

                    if (!handler) {
                        throw new Error(
                            `No handler registered for job: ${job.name}`,
                        );
                    }

                    await handler(
                        {
                            ...job,
                            id: message.id,
                        },
                        this.context!,
                    );
                },
                {
                    consumer: `job:${name}`,
                },
            );

        this.consumers.set(
            name,
            unsubscribe,
        );
    }

    // --------------------------------------------------
    // Queue Naming
    // --------------------------------------------------

    private getQueueName(
        name: string,
    ): string {
        return `phestus:jobs:${name}`;
    }
}