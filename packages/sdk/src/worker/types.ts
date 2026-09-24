export interface Worker {
    id: string;
    slug: string;
    capabilities?: string[];
    scope?: WorkerScope;
    status: WorkerStatus;
    metadata?: Record<string, unknown>;
    registeredAt: number;
    lastHeartbeat?: number;
}

type WorkerScope = {
    modules?: string[];
    jobs?: string[];
    queues?: string[];
    events?: string[];
};

type WorkerStatus =
    | "starting"
    | "active"
    | "draining"
    | "offline";

export interface WorkerCapability {
    slug: string;

    handle<TRequest, TResponse>(
        request: TRequest,
    ): Promise<TResponse>;
}

export interface WorkerHealth {
    status: "healthy" | "degraded" | "unhealthy";
    lastHeartbeat: number;
    uptime?: number;
    activeRequests?: number;
    capacity?: number;
}

export interface WorkerCapacity {
    concurrency: number;
    active: number;
}

export interface WorkerRequest<T = unknown> {
    capability: string;
    payload: T;
    scope?: WorkerScope;
}

export interface WorkerTransport {
    start(
        handler: WorkerRequestHandler,
    ): Promise<void>;

    stop(): Promise<void>;

    register(
        worker: Worker,
    ): Promise<void>;

    heartbeat(
        worker: Worker,
    ): Promise<void>;

    dispatch<TRequest, TResponse>(
        request: WorkerRequest<TRequest>,
    ): Promise<TResponse>;
}

export interface WorkerRequestHandler {
    handle<TRequest, TResponse>(
        request: WorkerRequest<TRequest>,
    ): Promise<TResponse>;
}

export interface WorkerProvider {
    registerWorker(worker: Worker): Promise<Worker>;

    getWorker(id: string): Promise<Worker | null>;

    listWorkers(): Promise<Worker[]>;

    removeWorker(id: string): Promise<void>;

    updateWorker(
        id: string,
        worker: Partial<Worker>,
    ): Promise<Worker>;

    dispatch<T>(
        request: WorkerRequest<T>,
    ): Promise<void>;

    heartbeat(id: string): Promise<void>;

    getHealth(id: string): Promise<WorkerHealth>;
}