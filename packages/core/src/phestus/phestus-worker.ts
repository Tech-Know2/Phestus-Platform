import type {
    Logger,
    PhestusModule,
    PhestusPlugin,
    EventBus,
    PhestusService,
    WorkerTransport,
    WorkerCapability,
    WorkerRequest
} from "@phestus/sdk";
import { PhestusHost } from "./phestus-host";


export interface PhestusWorkerConfig {
    id: string;
    slug: string;
    capabilities?: WorkerCapability[];

    plugins?: PhestusPlugin[];
    modules?: PhestusModule[];
    service?: PhestusService;
    logger: Logger;
    eventBus?: EventBus;
}

export class PhestusWorker extends PhestusHost {
    constructor(
        private readonly config: PhestusWorkerConfig,
        private readonly transport: WorkerTransport,
    ) {
        super(config);
    }

    getId() {
        return this.config.id
    }

    getSlug() {
        return this.config.slug;
    }

    getCapabilities() {
        return this.config.capabilities ?? [];
    }

    async initialize() {
        await super.initialize();

        await this.transport.register({
            id: this.config.id,
            slug: this.config.slug,
            capabilities: this.config.capabilities?.map(
                capability => capability.slug,
            ),
            status: "starting",
            registeredAt: Date.now(),
        });

        await this.transport.start({
            handle: (request) => this.handle(request),
        });
    }

    async shutdown() {
        await this.transport.stop();

        await super.shutdown();
    }

    async heartbeat() {
        await this.transport.heartbeat({
            id: this.config.id,
            slug: this.config.slug,
            capabilities: this.config.capabilities?.map(
                capability => capability.slug,
            ),
            status: "active",
            registeredAt: Date.now(),
        });
    }

    async handle<TRequest, TResponse>(
        request: WorkerRequest<TRequest>,
    ): Promise<TResponse> {
        const capability = this.config.capabilities?.find(
            capability =>
                capability.slug === request.capability,
        );

        if (!capability) {
            throw new Error(
                `Worker capability "${request.capability}" not found`,
            );
        }

        return capability.handle<TRequest, TResponse>(
            request.payload,
        );
    }
}