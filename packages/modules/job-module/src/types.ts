import type { PhestusContext } from "@phestus/sdk";

export interface Job<TPayload = unknown> {
    id?: string;
    name: string;
    payload: TPayload;
}

export interface JobHandler<TPayload = unknown> {
    (
        job: Job<TPayload>,
        context: PhestusContext,
    ): Promise<void>;
}

export interface JobOptions {
    queue: string;
}

export interface RegisteredJob {
    queue: string;
    handler: JobHandler;
}