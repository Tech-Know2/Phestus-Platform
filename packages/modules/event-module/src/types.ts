import type {
    EventHandler,
    PhestusEvent,
    PhestusProvider,
} from "@phestus/sdk";

export interface EventProvider extends PhestusProvider {
    module: "event";

    initialize(): Promise<void>;

    shutdown(): Promise<void>;

    emit<TData = unknown>(
        event: PhestusEvent<TData>,
    ): Promise<void>;

    subscribe<TData = unknown>(
        type: string,
        handler: EventHandler<TData>,
    ): Promise<() => Promise<void>>;
}