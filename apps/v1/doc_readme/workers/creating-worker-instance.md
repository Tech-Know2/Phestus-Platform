---
title: Creating a Worker Instance
description: How to create and configure an independent Phestus Worker instance with its own capabilities, modules, plugins, and services.
tags:
 - phestus
 - workers
 - worker-instance
 - configuration
order: 4
---

# Creating a Worker Instance

A `PhestusWorker` is an independently running Phestus host that exposes worker capabilities.

It extends `PhestusHost`, which means a worker can have its own modules, plugins, service, logger, and event bus.

```ts
export class PhestusWorker extends PhestusHost {
    // ...
}
```

This allows workers to run as independent Phestus applications while still using the same platform architecture.

## Worker Configuration

A worker is configured using `PhestusWorkerConfig`:

```ts
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
```

The most important fields are the worker's identity and capabilities.

```ts
const config: PhestusWorkerConfig = {
    id: "image-worker-01",
    slug: "image-worker",

    capabilities: [
        resizeImage,
        optimizeImage,
    ],

    logger,
};
```

## Creating a Capability

A capability is simply an object with a slug and handler.

```ts
const resizeImage: WorkerCapability = {
    slug: "image.resize",

    async handle(request: {
        imageId: string;
        width: number;
        height: number;
    }) {
        // Resize the image...

        return {
            imageId: request.imageId,
            width: request.width,
            height: request.height,
        };
    },
};
```

Another capability can be added:

```ts
const optimizeImage: WorkerCapability = {
    slug: "image.optimize",

    async handle(request: {
        imageId: string;
    }) {
        // Optimize the image...

        return {
            imageId: request.imageId,
            optimized: true,
        };
    },
};
```

Both capabilities can be exposed by the same worker:

```ts
const capabilities = [
    resizeImage,
    optimizeImage,
];
```

## Creating the Worker

A worker requires both its configuration and a transport:

```ts
const worker = new PhestusWorker(
    {
        id: "image-worker-01",
        slug: "image-worker",

        capabilities: [
            resizeImage,
            optimizeImage,
        ],

        logger,
    },
    transport,
);
```

The transport determines how the worker communicates with the rest of the system.

## Workers Can Have Their Own Modules

Because `PhestusWorker` extends `PhestusHost`, it can also contain modules.

```ts
const worker = new PhestusWorker(
    {
        id: "image-worker-01",
        slug: "image-worker",

        capabilities: [
            resizeImage,
            optimizeImage,
        ],

        modules: [
            imageModule,
            storageModule,
        ],

        plugins: [
            imagePlugin,
        ],

        service,
        logger,
        eventBus,
    },
    transport,
);
```

This is useful when a capability needs access to Phestus services or other platform functionality.

For example:

```ts
const resizeImage: WorkerCapability = {
    slug: "image.resize",

    async handle(request) {
        const image = await imageService
            .get(request.imageId);

        // Process image...

        return {
            success: true,
        };
    },
};
```

The worker is therefore not just a remote function runner. It is a complete Phestus host with a worker-facing execution layer.

## Starting the Worker

The worker lifecycle is managed through `initialize()`.

```ts
await worker.initialize();
```

Internally, initialization first initializes the underlying Phestus host:

```ts
await super.initialize();
```

The worker then registers itself:

```ts
await this.transport.register({
    id: this.config.id,
    slug: this.config.slug,
    capabilities: this.config.capabilities?.map(
        capability => capability.slug,
    ),
    status: "starting",
    registeredAt: Date.now(),
});
```

Finally, it starts listening for requests:

```ts
await this.transport.start({
    handle: (request) => this.handle(request),
});
```

This creates the connection between the transport and the worker's capability system.

## Handling Requests

When a request arrives, the worker searches its configured capabilities:

```ts
const capability =
    this.config.capabilities?.find(
        capability =>
            capability.slug === request.capability,
    );
```

If the capability does not exist, the worker rejects the request:

```ts
if (!capability) {
    throw new Error(
        `Worker capability "${request.capability}" not found`,
    );
}
```

Otherwise, the payload is passed to the capability:

```ts
return capability.handle(
    request.payload,
);
```

The complete flow is:

```text
Worker Transport
      │
      ▼
Worker.handle()
      │
      ▼
Find capability
      │
      ▼
capability.handle()
      │
      ▼
Result
```

## Heartbeats

A worker can periodically send a heartbeat:

```ts
await worker.heartbeat();
```

The worker reports itself as active:

```ts
await this.transport.heartbeat({
    id: this.config.id,
    slug: this.config.slug,
    capabilities: this.config.capabilities?.map(
        capability => capability.slug,
    ),
    status: "active",
    registeredAt: Date.now(),
});
```

A provider can use this information to determine whether a worker is still available.

## Shutting Down

Workers should stop their transport before shutting down the underlying Phestus host:

```ts
await worker.shutdown();
```

The implementation performs:

```ts
await this.transport.stop();

await super.shutdown();
```

This ensures the worker stops accepting new transport requests before its underlying services and modules are shut down.

## Multiple Worker Instances

Workers can be scaled horizontally by running multiple instances with unique IDs.

```text
image-worker
    │
    ├── image-worker-01
    ├── image-worker-02
    └── image-worker-03
```

Each instance can expose the same capabilities:

```ts
slug: "image-worker"

capabilities: [
    "image.resize",
    "image.optimize",
]
```

The provider and transport can then determine which worker should receive each request.

This allows the worker layer to scale independently from the main Phestus application.
