import type {
    EventBus,
    EventHandler,
    PhestusEvent,
    PhestusModule,
    PhestusContext,
} from "@phestus/sdk";

import type { EventProvider } from "./types";

export class EventModule implements PhestusModule, EventBus {
    manifest = {
        slug: "event",
        name: "Event Module",
        version: "0.1.0",
    };

    constructor(
        private readonly provider: EventProvider,
    ) { }

    async initialize(
        context: PhestusContext,
    ): Promise<void> {
        await this.provider.initialize();

        context.logger.info(
            "Event Module initialized",
        );
    }

    async shutdown(
        context: PhestusContext,
    ): Promise<void> {
        await this.provider.shutdown();

        context.logger.info(
            "Event Module shutdown",
        );
    }

    async emit<TData = unknown>(
        event: PhestusEvent<TData>,
    ): Promise<void> {
        await this.provider.emit(event);
    }

    async subscribe<TData = unknown>(
        type: string,
        handler: EventHandler<TData>,
    ): Promise<() => Promise<void>> {
        return await this.provider.subscribe(type, handler);
    }
}