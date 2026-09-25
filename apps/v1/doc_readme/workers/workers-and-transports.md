---
title: Workers and Transports
description: An overview of worker transports, how they connect workers to providers, and how to implement custom transport mechanisms.
tags:
 - phestus
 - workers
 - transports
 - providers
 - architecture
order: 5
---

# Workers and Transports

A worker transport is the communication layer between a worker and the rest of the worker system.

The Worker Module and Worker Provider define what the system can do. The transport determines **how requests actually reach a worker**.

```text
Phestus
   │
   ▼
Worker Module
   │
   ▼
Worker Provider
   │
   ▼
Worker Transport
   │
   ▼
Phestus Worker
```

This separation allows Phestus to support different communication mechanisms without changing the worker API.

## The WorkerTransport Interface

A transport implements:

```ts
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
```

Each method has a specific responsibility.

### `start()`

Starts the transport and provides it with a request handler.

```ts
await transport.start({
    handle: request => worker.handle(request),
});
```

The transport is responsible for receiving incoming requests and passing them to this handler.

### `stop()`

Stops the transport:

```ts
await transport.stop();
```

This is normally called when the worker shuts down.

### `register()`

Registers a worker with the underlying communication system:

```ts
await transport.register(worker);
```

The implementation might publish the worker to a registry, register a network endpoint, or store its information in another system.

### `heartbeat()`

Reports that a worker is still alive:

```ts
await transport.heartbeat(worker);
```

The underlying implementation determines how that heartbeat is communicated.

### `dispatch()`

Sends a request to a worker:

```ts
const result = await transport.dispatch({
    capability: "image.resize",
    payload: {
        imageId: "123",
        width: 1200,
        height: 800,
    },
});
```

The transport determines how the request reaches the appropriate worker.

## Transport vs Provider

It is useful to keep the provider and transport responsibilities separate.

The **provider** manages worker infrastructure:

```text
Worker Provider
├── Worker registration
├── Worker discovery
├── Worker metadata
├── Worker health
├── Worker state
└── Dispatch coordination
```

The **transport** manages communication:

```text
Worker Transport
├── Start communication
├── Stop communication
├── Register worker
├── Heartbeat
└── Send requests
```

For example:

```text
                    Worker Provider
                          │
             ┌────────────┴────────────┐
             │                         │
        Worker Registry           Transport
             │                         │
             │                    ┌────┴────┐
             │                    │         │
             ▼                    ▼         ▼
        Worker State          Worker A   Worker B
```

This means a provider can use different transports without changing the public worker API.

## Implementing a Custom Transport

A transport can be implemented for any communication mechanism.

For example, a very simple in-memory transport could look like this:

```ts
export class MemoryWorkerTransport
    implements WorkerTransport
{
    private handler?: WorkerRequestHandler;
    private workers = new Map<string, Worker>();

    async start(
        handler: WorkerRequestHandler,
    ) {
        this.handler = handler;
    }

    async stop() {
        this.handler = undefined;
    }

    async register(worker: Worker) {
        this.workers.set(worker.id, worker);
    }

    async heartbeat(worker: Worker) {
        this.workers.set(worker.id, {
            ...worker,
            lastHeartbeat: Date.now(),
        });
    }

    async dispatch<TRequest, TResponse>(
        request: WorkerRequest<TRequest>,
    ) {
        if (!this.handler) {
            throw new Error(
                "Worker transport is not started",
            );
        }

        return this.handler.handle<
            TRequest,
            TResponse
        >(request);
    }
}
```

This implementation is intentionally simple. It stores workers in memory and directly invokes the worker request handler.

A real transport could instead use:

* Redis
* Redis Streams
* HTTP
* WebSockets
* Message queues
* TCP
* Another custom messaging system

The Worker Transport interface does not need to know which mechanism is being used.

## Using a Transport With a Worker

Once a transport has been implemented, it can be passed directly to `PhestusWorker`:

```ts
const transport =
    new MemoryWorkerTransport();

const worker = new PhestusWorker(
    {
        id: "worker-01",
        slug: "example-worker",

        capabilities: [
            {
                slug: "example.hello",

                async handle(request: {
                    name: string;
                }) {
                    return {
                        message:
                            `Hello ${request.name}`,
                    };
                },
            },
        ],

        logger,
    },

    transport,
);
```

The worker does not need to know how the transport communicates.

It only needs to provide the handler:

```ts
await transport.start({
    handle: request =>
        worker.handle(request),
});
```

## Extending Transports

The transport interface is intentionally small so that implementations can add their own infrastructure.

For example, a Redis-based transport could maintain a worker registry and communicate through Redis Streams:

```text
Worker Provider
      │
      ▼
Redis Worker Transport
      │
      ├── Worker Registry
      ├── Heartbeats
      └── Request Stream
              │
              ▼
        Phestus Worker
```

An HTTP transport could instead expose an endpoint:

```text
Worker Provider
      │
      ▼
HTTP Transport
      │
      │ POST /workers/:id/dispatch
      ▼
Phestus Worker
```

The worker itself does not need to change.

Its capabilities remain:

```ts
const capability: WorkerCapability = {
    slug: "image.resize",

    async handle(request) {
        // Process request...
    },
};
```

Only the communication implementation changes.

## Transport Lifecycle

A transport follows the lifecycle of its worker:

```text
PhestusWorker.initialize()
        │
        ▼
transport.register()
        │
        ▼
transport.start()
        │
        ▼
Worker Running
        │
        ├── transport.dispatch()
        ├── transport.heartbeat()
        └── requests
        │
        ▼
PhestusWorker.shutdown()
        │
        ▼
transport.stop()
```

This gives transports a predictable lifecycle while keeping the implementation independent from the worker itself.

## Choosing a Transport

The transport should be selected based on how workers need to communicate.

A local development environment may use an in-memory transport:

```ts
new MemoryWorkerTransport();
```

A distributed application could use a networked transport:

```ts
new RedisWorkerTransport(config);
```

Or an application could implement its own transport:

```ts
new CustomWorkerTransport(config);
```

The important part is that every transport satisfies the same `WorkerTransport` interface.

This allows the worker architecture to remain stable while the underlying communication mechanism evolves.
