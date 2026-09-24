---
title: Introduction
description: An introduction to providers and how they implement capabilities within the Phestus ecosystem
tags:
 - phestus
 - providers
 - introduction
 - web stack
 - web framework
 - modular
order: 1
---

# Providers

Providers are the implementation layer of the Phestus ecosystem.

A **module** defines a capability that an application can use. A **provider** supplies the concrete implementation of that capability.

This separation allows Phestus to define functionality without coupling that functionality to a particular technology, database, service, or library.

For example, the Queue Module defines what a queue system should be able to do:

```ts
await queue.enqueue(
    "emails",
    {
        to: "user@example.com",
    },
);
```

The Queue Module does not need to know whether that queue is backed by BullMQ, Redis, Amazon SQS, or another system.

A provider implements that capability.

```text
Queue Module
     │
     │ capability
     ▼
Queue Provider
     │
     │ implementation
     ▼
BullMQ
```

This allows the application to work against the module's API while the provider handles the underlying technology.

## Why Providers Exist

Phestus is designed to keep application capabilities independent from their implementations.

Without providers, a module would need to make implementation decisions itself.

For example, a queue module might directly depend on BullMQ:

```text
Queue Module
     │
     └── BullMQ
```

That creates a strong coupling between the module and the underlying queue technology.

With providers, the relationship becomes:

```text
             ┌── BullMQ Provider
             │
Queue Module ├── SQS Provider
             │
             └── Custom Provider
```

The module defines the contract while providers determine how that contract is fulfilled.

This makes capabilities replaceable without requiring the module itself to change.

## Modules Define Capabilities

A module is responsible for defining a capability.

For example, the Queue Module can define operations such as:

* enqueueing messages
* consuming messages
* publishing messages
* subscribing to topics

The module defines the interface that providers must implement.

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
    ): Promise<() => Promise<void>>;
}
```

The module therefore describes **what can be done**.

It does not need to describe exactly **how it is done**.

## Providers Implement Capabilities

A provider implements a module's interface.

For example, the BullMQ provider implements the Queue Module's `QueueProvider` interface:

```ts
export class BullMQQueueProvider
    implements QueueProvider
{
    // ...
}
```

The provider then translates the module's operations into operations supported by the underlying technology.

```text
Phestus
   │
   ▼
Queue Module
   │
   ▼
QueueProvider
   │
   ▼
BullMQQueueProvider
   │
   ▼
BullMQ
```

This keeps the implementation details out of the module.

## Provider Identity

Every provider has a unique identity within the Phestus runtime.

The base provider contract contains:

```ts
export interface PhestusProvider {
    slug: string;
    name: string;
    version: string;
    moduleSlug: string;

    dependencies?: PhestusDependency[];

    initialize?(context: PhestusContext): Promise<void>;
    shutdown?(context: PhestusContext): Promise<void>;
}
```

The important fields are:

* `slug` — the provider's unique identifier.
* `name` — the human-readable provider name.
* `version` — the provider version.
* `moduleSlug` — the module capability the provider implements.
* `dependencies` — other Phestus components required by the provider.
* `initialize` — optional startup lifecycle hook.
* `shutdown` — optional shutdown lifecycle hook.

A BullMQ provider might therefore identify itself as:

```ts
export class BullMQQueueProvider
    implements QueueProvider
{
    slug = "bullmq";
    name = "BullMQ Queue Provider";
    moduleSlug = "queue";
    version = "0.1.0";
}
```

The `moduleSlug` connects the provider to its capability:

```text
bullmq
   │
   └── implements → queue
```

## Providers Are Technology Boundaries

Providers are where technology-specific implementation belongs.

A module should not need to know that a provider uses:

* Redis
* BullMQ
* Stripe
* PostgreSQL
* S3
* Twilio
* Resend
* another API
* or a custom implementation

Those details belong inside the provider.

For example:

```text
Queue Module
    │
    ├── defines QueueProvider
    │
    └── remains technology agnostic


BullMQ Provider
    │
    ├── implements QueueProvider
    ├── manages BullMQ queues
    ├── manages BullMQ workers
    └── manages BullMQ connections
```

This creates a clean boundary between the application capability and the technology providing it.

## Providers Are Registered With Phestus

Providers are registered with the Phestus runtime.

A provider can be supplied by a plugin:

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

The plugin supplies its providers:

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

Phestus registers those providers and makes them available through its runtime.

Providers can then be retrieved by their slug:

```ts
const provider = phestus.getProvider("bullmq");
```

The provider itself can also be used by the module responsible for its capability.

## Provider Lifecycle

Providers may participate in the Phestus runtime lifecycle.

A provider can implement:

```ts
initialize(
    context: PhestusContext,
): Promise<void>
```

and:

```ts
shutdown(
    context: PhestusContext,
): Promise<void>
```

Initialization is where a provider can prepare resources required during application execution.

Shutdown is where the provider should release those resources.

For example, the BullMQ provider closes its workers and queues during shutdown:

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
}
```

Providers therefore have a well-defined place to manage resources owned by their implementation.

## Provider Context

Providers receive the shared Phestus context during lifecycle operations.

```ts
export interface PhestusContext {
    service: PhestusService;
    logger: Logger;
    eventBus: EventBus;
}
```

This gives providers access to shared application infrastructure without requiring them to construct their own instances.

For example:

```ts
async initialize(
    context: PhestusContext,
): Promise<void> {
    context.logger.info(
        "BullMQ Queue Provider initialized",
    );
}
```

The context keeps provider implementations integrated with the rest of the Phestus runtime.

## Providers in the Phestus Architecture

The relationship between the major pieces can be summarized as:

```text
Plugin
  │
  ├── Modules
  │     │
  │     └── define capabilities
  │
  └── Providers
        │
        └── implement capabilities
              │
              └── external technology
```

This separation is one of the core architectural principles of Phestus.

**Modules define capabilities. Providers implement those capabilities. Plugins package and distribute them.**

The result is a system where functionality can be composed without forcing the application to depend directly on a particular implementation.
