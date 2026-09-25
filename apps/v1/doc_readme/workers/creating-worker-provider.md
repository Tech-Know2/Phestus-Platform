---
title: Creating a Worker Provider
description: How to create a Worker Provider and connect worker registration, discovery, health, and dispatch to a transport.
tags:
 - phestus
 - workers
 - providers
 - architecture
order: 3
---

# Creating a Worker Provider

The Worker Provider is the infrastructure layer behind the Worker Module.

The module defines the API that Phestus uses. The provider implements that API.

```text
Worker Module
      │
      ▼
Worker Provider
      │
      ▼
Worker Transport
```

This allows different applications to implement worker infrastructure using different storage and communication systems.

## The WorkerProvider Interface

A provider implements:

```ts
export interface WorkerProvider {
    registerWorker(
        worker: Worker,
    ): Promise<Worker>;

    getWorker(
        id: string,
    ): Promise<Worker | null>;

    listWorkers(): Promise<Worker[]>;

    removeWorker(
        id: string,
    ): Promise<void>;

    updateWorker(
        id: string,
        worker: Partial<Worker>,
    ): Promise<Worker>;

    dispatch<T>(
        request: WorkerRequest<T>,
    ): Promise<void>;

    heartbeat(
        id: string,
    ): Promise<void>;

    getHealth(
        id: string,
    ): Promise<WorkerHealth>;
}
```

A provider therefore owns the worker management operations, but it does not define the worker capability implementation itself.

## A Simple Provider

A basic in-memory provider can be useful for development and testing.

```ts
export class MemoryWorkerProvider
    implements WorkerProvider
{
    private workers = new Map<string, Worker>();

    constructor(
        private readonly transport: WorkerTransport,
    ) {}

    async registerWorker(
        worker: Worker,
    ) {
        this.workers.set(worker.id, worker);

        await this.transport.register(worker);

        return worker;
    }

    async getWorker(id: string) {
        return this.workers.get(id) ?? null;
    }

    async listWorkers() {
        return Array.from(this.workers.values());
    }

    async removeWorker(id: string) {
        this.workers.delete(id);
    }

    async updateWorker(
        id: string,
        updates: Partial<Worker>,
    ) {
        const worker = this.workers.get(id);

        if (!worker) {
            throw new Error(`Worker "${id}" not found`);
        }

        const updated = {
            ...worker,
            ...updates,
        };

        this.workers.set(id, updated);

        return updated;
    }

    async dispatch<T>(
        request: WorkerRequest<T>,
    ) {
        await this.transport.dispatch(request);
    }

    async heartbeat(id: string) {
        const worker = this.workers.get(id);

        if (!worker) {
            throw new Error(`Worker "${id}" not found`);
        }

        const updated = {
            ...worker,
            lastHeartbeat: Date.now(),
            status: "active" as const,
        };

        this.workers.set(id, updated);

        await this.transport.heartbeat(updated);
    }

    async getHealth(id: string) {
        const worker = this.workers.get(id);

        if (!worker) {
            throw new Error(`Worker "${id}" not found`);
        }

        return {
            status: worker.status === "active"
                ? "healthy"
                : "degraded",
            lastHeartbeat:
                worker.lastHeartbeat ?? 0,
        };
    }
}
```

This example keeps the worker registry in memory.

A production provider could instead store worker information in Redis, a database, or another service.

## Provider and Transport

The provider and transport have different responsibilities.

The provider manages **worker state and discovery**:

```text
Provider
├── registerWorker()
├── getWorker()
├── listWorkers()
├── updateWorker()
├── removeWorker()
├── heartbeat()
└── getHealth()
```

The transport manages **communication**:

```text
Transport
├── start()
├── stop()
├── register()
├── heartbeat()
└── dispatch()
```

Keeping these responsibilities separate is important.

For example, a provider might store worker metadata in Redis while using Redis Streams, HTTP, or another mechanism to communicate with workers.

## Registering the Provider

The provider is passed to the Worker Module:

```ts
const provider = new MemoryWorkerProvider(
    transport,
);

const workerModule = new WorkerModule(
    provider,
);
```

The module can then be registered with the Phestus host:

```ts
const phestus = new Phestus({
    service,
    logger,
    eventBus,

    modules: [
        workerModule,
    ],
});
```

The application now has access to the worker system without being coupled to the provider implementation.

## Dispatching Through the Provider

When the application dispatches work:

```ts
await workerModule.dispatch({
    capability: "image.resize",
    payload: {
        imageId: "123",
        width: 1200,
        height: 800,
    },
});
```

The request travels through the provider and into the configured transport.

```text
Worker Module
      │
      ▼
Worker Provider
      │
      ▼
Worker Transport
      │
      ▼
Worker
```

The provider therefore acts as the infrastructure boundary between Phestus and the worker system.

## Provider Design

Different providers can implement the same interface:

```text
             WorkerProvider
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
      Redis      Database    Custom
     Provider    Provider    Provider
```

The application does not need to change its worker-facing code when the provider changes.

This follows the same provider architecture used throughout Phestus: the module defines the capability, while the provider supplies the implementation.
