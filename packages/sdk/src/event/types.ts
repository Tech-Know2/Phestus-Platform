export interface PhestusEvent<TData = unknown> {
    id: string;
    type: string;
    source: string;
    data: TData;
    timestamp: Date;
}

export interface EventHandler<TData = unknown> {
    event: string;
    handle(event: PhestusEvent<TData>): Promise<void>;
}

export interface EventBus {
    emit<TData = unknown>(
        event: PhestusEvent<TData>
    ): Promise<void>;

    subscribe<TData = unknown>(
        type: string,
        handler: EventHandler<TData>
    ): Promise<() => Promise<void>>;
}