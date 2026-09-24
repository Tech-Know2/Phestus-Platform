---
title: Creating a Provider
description: Learn how to create and implement a provider for a Phestus module
tags:
 - phestus
 - providers
 - implementation
 - modules
 - plugins
 - web framework
 - modular
order: 2
---

# Creating a Provider

A provider implements a module's capability using a concrete technology or service.

Creating a provider generally consists of four steps:

1. Identify the module capability.
2. Implement the module's provider interface.
3. Implement provider lifecycle behavior when required.
4. Register the provider with Phestus.

This guide uses the Queue Module and BullMQ as an example.

## 1. Identify the Module

Before creating a provider, determine which module capability the provider will implement.

For example:

```text
Queue Module
```

The Queue Module exposes a provider interface:

```ts
export interface QueueProvider {
    enqueue<T>(
        queueName: string,
        payload: T,
    ): Promise<void>;

    consume<T>(
        queueName: string,
        handler: (
            message: QueueMessage<T>,
        ) => Promise<void>,
        options?: QueueConsumeOptions,
    ): Promise<() => Promise<void>>;

    publish<T>(
        topic: string,
        payload: T,
    ): Promise<void>;

    subscribe<T>(
        topic: string,
        handler: (
            message: QueueMessage<T>,
        ) => Promise<void>,
        options: TopicSubscribeOptions,
    ): Promise<() => Promise<void>>;
}
```

This interface is the contract your provider must satisfy.

The provider should implement the capability rather than redefine it.

## 2. Implement the Provider

Create a class that implements the module's provider interface.

```ts
import type {
    QueueProvider,
} from "@phestus/queue-module";

export class BullMQQueueProvider
    implements QueueProvider
{
    // ...
}
```

The provider now needs to implement every operation required by `QueueProvider`.

For example:

```ts
async enqueue<T>(
    queueName: string,
    payload: T,
): Promise<void> {
    const queue =
        this.getQueue(queueName);

    await queue.add(
        queueName,
        payload,
        this.defaultJobOptions,
    );
}
```

The implementation can use whatever technology is appropriate.

In this example, BullMQ is responsible for actually creating and processing the queue.

## 3. Define Provider Metadata

Providers implement the `PhestusProvider` contract through their identity properties.

```ts
export class BullMQQueueProvider
    implements QueueProvider
{
    slug = "bullmq";
    name = "BullMQ Queue Provider";
    moduleSlug = "queue";
    version = "0.1.0";

    // ...
}
```

### `slug`

The provider slug uniquely identifies the provider.

```ts
slug = "bullmq";
```

It is used when retrieving the provider:

```ts
phestus.getProvider("bullmq");
```

Provider slugs should be stable and descriptive.

### `name`

The name is the human-readable provider name:

```ts
name = "BullMQ Queue Provider";
```

### `moduleSlug`

The module slug identifies the capability implemented by the provider:

```ts
moduleSlug = "queue";
```

This establishes the relationship:

```text
bullmq → queue
```

The provider implements the Queue Module.

### `version`

The provider version identifies the provider release:

```ts
version = "0.1.0";
```

Provider versions are independent of the underlying technology's version.

For example, a provider might be:

```ts
version = "0.1.0";
```

while using BullMQ `5.x`.

## 4. Accept Configuration

Providers commonly need configuration for their underlying technology.

Use the provider constructor to accept that configuration.

```ts
export interface BullMQQueueProviderConfig {
    connection: ConnectionOptions;
    defaultJobOptions?: JobsOptions;
}
```

The provider can then store the configuration:

```ts
export class BullMQQueueProvider
    implements QueueProvider
{
    private readonly connection: ConnectionOptions;
    private readonly defaultJobOptions;

    constructor(
        config: BullMQQueueProviderConfig,
    ) {
        this.connection = config.connection;
        this.defaultJobOptions =
            config.defaultJobOptions;
    }
}
```

This keeps implementation configuration separate from the module itself.

The Queue Module does not need to know anything about the BullMQ connection.

## 5. Manage Provider Resources

Providers are responsible for resources they create.

The BullMQ provider maintains queues and workers:

```ts
private readonly queues =
    new Map<string, Queue<any>>();

private readonly workers =
    new Map<string, Worker<any>>();
```

When a queue is requested, the provider creates it if necessary:

```ts
private getQueue(
    queueName: string,
): Queue<any> {
    const existing =
        this.queues.get(queueName);

    if (existing) {
        return existing;
    }

    const queue =
        new Queue(
            queueName,
            {
                connection: this.connection,
                defaultJobOptions:
                    this.defaultJobOptions,
            },
        );

    this.queues.set(
        queueName,
        queue,
    );

    return queue;
}
```

The provider therefore owns the implementation-specific resource lifecycle.

## 6. Implement Initialization

Providers may implement an initialization hook:

```ts
async initialize(
    context: PhestusContext,
): Promise<void> {
    context.logger.info(
        "BullMQ Queue Provider initialized",
    );
}
```

Initialization should be used for setup that must occur when the Phestus runtime starts.

Examples include:

* validating configuration
* establishing connections
* preparing clients
* registering listeners
* creating required resources
* starting background processes

Not every provider needs initialization logic.

The method is optional.

## 7. Implement Shutdown

Providers should clean up resources they own.

```ts
async shutdown(
    context: PhestusContext,
): Promise<void> {
    await Promise.all(
        [...this.workers.values()].map(
            worker => worker.close(),
        ),
    );

    await Promise.all(
        [...this.queues.values()].map(
            queue => queue.close(),
        ),
    );

    this.workers.clear();
    this.queues.clear();

    context.logger.info(
        "BullMQ Queue Provider shutdown",
    );
}
```

Shutdown should leave the provider in a clean state.

If a provider creates:

* workers
* timers
* connections
* listeners
* subscriptions
* clients
* file handles
* or other long-lived resources

those resources should be released during shutdown.

## 8. Use the Phestus Context

Provider lifecycle methods receive a `PhestusContext`:

```ts
export interface PhestusContext {
    service: PhestusService;
    logger: Logger;
    eventBus: EventBus;
}
```

The context provides access to shared Phestus infrastructure.

For logging:

```ts
context.logger.info(
    "Provider initialized",
);
```

For application services:

```ts
await context.service.data.find({
    // ...
});
```

For events:

```ts
await context.eventBus.publish({
    // ...
});
```

Providers should use the supplied context instead of constructing duplicate application infrastructure.

## 9. Add Dependencies When Required

Providers can declare dependencies:

```ts
dependencies = [
    {
        type: "module",
        slug: "queue",
        version: "0.1.0",
    },
];
```

Dependencies use the common Phestus dependency format:

```ts
export interface PhestusDependency {
    type:
        | "plugin"
        | "module"
        | "provider";

    slug: string;
    version: string;
    optional?: boolean;
}
```

A dependency can therefore target:

* another plugin
* a module
* another provider

For example:

```ts
dependencies = [
    {
        type: "provider",
        slug: "redis",
        version: "0.1.0",
    },
];
```

Optional dependencies can be declared with:

```ts
optional: true
```

This allows a provider to describe the other components it expects to exist within the Phestus environment.

## 10. Register the Provider

Providers are registered with Phestus.

Providers are commonly distributed through plugins.

For example:

```ts
const queuePlugin: PhestusPlugin = {
    manifest: {
        slug: "queue-plugin",
        name: "Queue Plugin",
        version: "0.1.0",
    },

    providers: [
        new BullMQQueueProvider({
            connection,
        }),
    ],
};
```

The plugin can then be passed to Phestus:

```ts
const phestus = new Phestus({
    service,
    logger,
    eventBus,

    plugins: [
        queuePlugin,
    ],
});
```

Phestus registers the plugin and its providers during construction.

## 11. Retrieve the Provider

Once registered, the provider is available through Phestus:

```ts
const provider =
    phestus.getProvider("bullmq");
```

Modules can use the registered provider according to the module's provider resolution behavior.

The application therefore interacts with the module capability rather than needing to construct the provider itself.

## Complete Example

A simplified provider can look like this:

```ts
import type {
    PhestusContext,
} from "@phestus/sdk";

import type {
    QueueProvider,
} from "@phestus/queue-module";

export class ExampleQueueProvider
    implements QueueProvider
{
    slug = "example";
    name = "Example Queue Provider";
    moduleSlug = "queue";
    version = "0.1.0";

    async initialize(
        context: PhestusContext,
    ): Promise<void> {
        context.logger.info(
            "Example Queue Provider initialized",
        );
    }

    async enqueue<T>(
        queueName: string,
        payload: T,
    ): Promise<void> {
        // Implement queue behavior.
    }

    async consume<T>(
        queueName: string,
        handler,
    ) {
        // Implement consumer behavior.
    }

    async publish<T>(
        topic: string,
        payload: T,
    ): Promise<void> {
        // Implement topic behavior.
    }

    async subscribe<T>(
        topic: string,
        handler,
        options,
    ) {
        // Implement subscription behavior.
    }

    async shutdown(
        context: PhestusContext,
    ): Promise<void> {
        context.logger.info(
            "Example Queue Provider shutdown",
        );
    }
}
```

The important principle is that the provider implements the module's contract while keeping the underlying implementation private.

```text
Module
  │
  │ defines
  ▼
Provider Interface
  │
  │ implemented by
  ▼
Provider
  │
  │ uses
  ▼
Technology / Service
```

Once the provider has been implemented and packaged, it can be distributed through a Phestus plugin and registered with the application.
