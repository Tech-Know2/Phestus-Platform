---
title: Creating A Module
description: An indepth guide into the creation of a module and how it integrates into Phestus and the rest of the stack
tags:
  - phestus
  - modules
  - providers
  - typing
  - web stack
  - web framework
  - modular
order: 2
---

## Defining Types

Building a module typically begins by defining the types associated with the functionality it provides.

For example, a queue module may need types for messages, queue consumption, and topic subscriptions. These types become part of the module's public contract and can be used by providers, plugins, other modules, or the application itself.

The following types are used by `@phestus/queue-module`:

```ts
export interface QueueMessage<T = unknown> {
    id: string;
    payload: T;
}

export interface QueueConsumeOptions {
    consumer?: string;
}

export interface TopicSubscribeOptions {
    subscriber: string;
}
```

These types describe the data that the queue module expects without making any assumptions about how the queue is implemented.

For example, `QueueMessage` defines the structure of a message, but it does not define whether that message comes from Redis, an in-memory queue, or another messaging system.

Keeping these types separate from the implementation allows providers to share the same contract while using completely different underlying technologies.

## Defining a Provider Contract

Once the module's types have been established, the next step is to define its provider contract.

The provider contract describes the functionality that an implementation must provide in order to work with the module.

For example, the queue provider contract from `@phestus/queue-module` is:

```ts
export interface QueueProvider extends PhestusProvider {
    // --------------------------------------------------
    // Queue
    // --------------------------------------------------

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

    // --------------------------------------------------
    // Topic
    // --------------------------------------------------

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

The `QueueProvider` defines the operations that every queue provider must implement.

A Redis provider, for example, could implement these operations using Redis Streams, while another provider could use a completely different queueing system. Both implementations would still satisfy the same `QueueProvider` contract.

### The Phestus Provider Contract

Every provider extends the core `PhestusProvider` interface provided by `@phestus/sdk`.

```ts
import type {
    PhestusContext,
    PhestusDependency,
} from "../types";

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

This provides the basic contract required for provider management within Phestus.

The core provider contract handles:
* Provider identification through `slug`
* Provider naming and versioning
* Association with a module through `moduleSlug`
* Provider dependencies
* Initialization
* Shutdown

The module-specific provider interface can then extend this contract with the functionality required by the module.

For example:

```text
PhestusProvider
       │
       └── QueueProvider
               │
               ├── enqueue()
               ├── consume()
               ├── publish()
               └── subscribe()
```

This gives the Phestus runtime a consistent way to manage providers while allowing each module to define its own provider capabilities.

For more information about implementing providers, see the **Providers** section of the documentation.

## Implementing the Module

Once the module's types and provider contract have been defined, the module itself can be implemented.

The module is responsible for exposing the functionality defined by its contract and delegating the actual implementation to its provider.

For example, the `@phestus/queue-module` can be implemented as follows:

```ts
import type {
    PhestusContext,
    PhestusModule,
} from "@phestus/sdk";

import type {
    QueueProvider,
} from "./types";

export class QueueModule implements PhestusModule {
    manifest = {
        slug: "queue",
        name: "Queue Module",
        version: "0.1.0",
    };

    constructor(
        private readonly provider: QueueProvider,
    ) {}

    async initialize(
        context: PhestusContext,
    ): Promise<void> {
        await this.provider.initialize?.(
            context,
        );

        context.logger.info(
            "Queue Module initialized",
        );
    }

    async shutdown(
        context: PhestusContext,
    ): Promise<void> {
        await this.provider.shutdown?.(
            context,
        );

        context.logger.info(
            "Queue Module shutdown",
        );
    }

    // --------------------------------------------------
    // Queue
    // --------------------------------------------------

    async enqueue<T>(
        queueName: string,
        payload: T,
    ): Promise<void> {
        await this.provider.enqueue(
            queueName,
            payload,
        );
    }

    async consume<T>(
        queueName: string,
        handler: (
            message: QueueMessage<T>,
        ) => Promise<void>,
        options?: QueueConsumeOptions,
    ): Promise<() => Promise<void>> {
        return await this.provider.consume(
            queueName,
            handler,
            options,
        );
    }

    // --------------------------------------------------
    // Topics
    // --------------------------------------------------

    async publish<T>(
        topic: string,
        payload: T,
    ): Promise<void> {
        await this.provider.publish(
            topic,
            payload,
        );
    }

    async subscribe<T>(
        topic: string,
        handler: (
            message: QueueMessage<T>,
        ) => Promise<void>,
        options: TopicSubscribeOptions,
    ): Promise<() => Promise<void>> {
        return await this.provider.subscribe(
            topic,
            handler,
            options,
        );
    }
}
```

The module itself does not need to know how any of these operations are implemented.

For example, when `enqueue()` is called:

```text
Application
     │
     ▼
QueueModule.enqueue()
     │
     ▼
QueueProvider.enqueue()
     │
     ▼
Provider implementation
     │
     ▼
Queue backend
```

The module provides the stable interface, while the provider handles the implementation.

## Putting It Together

A module therefore consists of several layers:

```text
Module
│
├── Types
│   └── Defines shared data structures
│
├── Provider Contract
│   └── Defines required implementations
│
├── Module
│   ├── Defines the manifest
│   ├── Exposes module functionality
│   └── Manages lifecycle
│
└── Provider
    └── Implements the module functionality
```

This structure keeps the module independent from the technology used to implement it.

When creating a new module, the general process is:
1. **Define the types** required by the module.
2. **Define the provider contract** for implementing those capabilities.
3. **Implement the module** using `PhestusModule`.
4. **Delegate functionality to the provider.**
5. **Define dependencies and lifecycle behavior** where necessary.

The result is a module with a stable public interface that can support different providers without changing the way the rest of the Phestus Platform interacts with it.