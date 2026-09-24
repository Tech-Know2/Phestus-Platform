---
title: Providers & Modules
description: Understanding the relationship between modules and providers in the Phestus architecture
tags:
 - phestus
 - providers
 - modules
 - architecture
 - capabilities
 - web stack
 - modular
order: 4
---

# Providers & Modules

Modules and providers are two separate parts of the Phestus architecture.

A module defines a capability.

A provider implements that capability.

This distinction allows Phestus to remain modular without forcing every module to depend on a particular technology.

## The Basic Relationship

The relationship can be represented as:

```text
Module
  │
  │ defines
  ▼
Capability
  │
  │ implemented by
  ▼
Provider
  │
  │ uses
  ▼
Technology
```

For example:

```text
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

The Queue Module defines what a queue system can do.

The BullMQ provider determines how those operations are performed.

## Why Not Put the Implementation in the Module?

It would be possible to build the Queue Module directly around BullMQ.

For example:

```text
Queue Module
     │
     └── BullMQ
```

However, this means the module is coupled to BullMQ.

Replacing BullMQ would require changing the module itself.

The provider model separates those concerns:

```text
Queue Module
     │
     ├── BullMQ Provider
     ├── SQS Provider
     └── Custom Provider
```

The Queue Module remains focused on the queue capability.

Each provider is responsible for translating that capability into a particular implementation.

## Modules Define Interfaces

A module can define a provider interface.

For example:

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
}
```

The interface defines the operations required from a queue implementation.

The module does not need to know how those operations are implemented.

## Providers Implement Interfaces

A provider implements the interface:

```ts
export class BullMQQueueProvider
    implements QueueProvider
{
    // ...
}
```

The implementation can then use BullMQ:

```ts
const queue =
    new Queue(
        queueName,
        {
            connection: this.connection,
            defaultJobOptions:
                this.defaultJobOptions,
        },
    );
```

BullMQ-specific code remains inside the provider.

## Provider Metadata Connects the Two

The provider identifies its module through `moduleSlug`:

```ts
moduleSlug = "queue";
```

The provider itself has a unique slug:

```ts
slug = "bullmq";
```

Together, these establish:

```text
Provider: bullmq
Module:   queue
```

Or conceptually:

```text
bullmq implements queue
```

This metadata allows the Phestus runtime to understand which capability a provider belongs to.

## Multiple Providers

A module can have multiple providers.

For example:

```text
              Queue Module
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
     BullMQ       SQS       Custom
```

Each provider implements the same capability.

This allows applications to choose an implementation without changing the module's API.

The module remains stable while provider implementations can evolve independently.

## Provider Selection

Providers are registered with the Phestus runtime.

For example:

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

The plugin can supply the provider:

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

Phestus registers the provider:

```ts
this.providers.register(
    provider,
);
```

The runtime can then retrieve it:

```ts
phestus.getProvider(
    "bullmq",
);
```

The important point is that the application does not need to construct the provider while using the module.

The provider becomes part of the configured Phestus runtime.

## Plugins Package Providers

Providers are commonly distributed through plugins.

This gives Phestus three distinct architectural responsibilities:

```text
Module
  │
  └── defines capability

Provider
  │
  └── implements capability

Plugin
  │
  └── packages and distributes
      modules and providers
```

For example:

```text
Queue Plugin
     │
     ├── Queue Module
     │
     └── BullMQ Provider
```

The plugin provides the pieces required to add that capability to an application.

## A Complete Example

Consider a queue implementation.

### Module

The Queue Module defines the capability:

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

### Provider

The BullMQ provider implements it:

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

### Plugin

The plugin packages the provider:

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

### Application

The application registers the plugin:

```ts
const phestus =
    new Phestus({
        service,
        logger,
        eventBus,

        plugins: [
            queuePlugin,
        ],
    });
```

The final architecture becomes:

```text
Application
     │
     ▼
  Phestus
     │
     ▼
Queue Plugin
     │
     ├── Queue Module
     │       │
     │       └── Queue capability
     │
     └── BullMQ Provider
             │
             └── BullMQ
```

## The Separation of Responsibilities

The separation can be summarized simply.

### Modules

Modules answer:

> **What can the application do?**

They define capabilities and the interfaces through which those capabilities are consumed.

### Providers

Providers answer:

> **How is that capability implemented?**

They contain technology-specific implementation details.

### Plugins

Plugins answer:

> **How are these pieces packaged and introduced into an application?**

They can distribute modules and providers together and declare the dependencies required by those components.

## Building Against Capabilities

The provider architecture encourages application code to depend on capabilities rather than technologies.

Instead of designing an application around:

```text
BullMQ
Redis
Stripe
PostgreSQL
```

the application can work with:

```text
Queue
Payments
Storage
Data
```

The underlying implementations remain replaceable.

This is the purpose of the provider abstraction in Phestus:

```text
Application
     │
     ▼
Capability
     │
     ▼
Provider
     │
     ▼
Implementation
```

The application knows what it needs to accomplish.

The provider determines how the underlying technology accomplishes it.
