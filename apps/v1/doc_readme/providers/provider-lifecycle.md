---
title: Provider Lifecycle & Dependencies
description: Documentation on provider lifecycle, dependencies, context, initialization, and shutdown within Phestus
tags:
 - phestus
 - providers
 - lifecycle
 - dependencies
 - architecture
 - web stack
 - modular
order: 3
---

# Provider Lifecycle & Dependencies

Providers are runtime components.

They may create resources, establish connections, register listeners, start workers, and integrate external technologies into Phestus.

Because of this, providers have a defined lifecycle and dependency model.

A provider can participate in two lifecycle phases:

```text
initialize
    │
    ▼
Running
    │
    ▼
shutdown
```

Both lifecycle methods are optional.

## Provider Lifecycle

The provider lifecycle is represented by two methods:

```ts
initialize?(
    context: PhestusContext,
): Promise<void>;

shutdown?(
    context: PhestusContext,
): Promise<void>;
```

A provider does not have to implement either method.

A provider that does not require startup or shutdown behavior can simply implement the module interface.

```ts
export class ExampleProvider
    implements ExampleModuleProvider
{
    slug = "example";
    name = "Example Provider";
    moduleSlug = "example";
    version = "0.1.0";
}
```

Lifecycle methods should be added when the implementation owns runtime resources.

## Initialization

Initialization occurs when the Phestus runtime starts.

```ts
async initialize(
    context: PhestusContext,
): Promise<void> {
    // Prepare provider.
}
```

Initialization is intended for setup that should happen once before the provider begins normal operation.

Common initialization tasks include:

* validating provider configuration
* establishing external connections
* initializing SDK clients
* preparing internal state
* registering listeners
* starting workers
* preparing subscriptions

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

The provider receives the shared runtime context rather than constructing its own application services.

## Shutdown

Shutdown occurs when the Phestus runtime is stopped.

```ts
async shutdown(
    context: PhestusContext,
): Promise<void> {
    // Release provider resources.
}
```

Shutdown is responsible for cleaning up resources owned by the provider.

For example, the BullMQ provider maintains workers and queues:

```ts
private readonly queues =
    new Map<string, Queue<any>>();

private readonly workers =
    new Map<string, Worker<any>>();
```

During shutdown, those resources are closed:

```ts
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
```

The internal collections can then be cleared:

```ts
this.workers.clear();
this.queues.clear();
```

This prevents the provider from retaining resources after shutdown.

## Resource Ownership

A useful rule when implementing providers is:

> A provider should clean up the resources it creates.

For example:

```text
Provider
  │
  ├── creates connection
  ├── creates workers
  ├── creates subscriptions
  └── creates timers
          │
          ▼
       shutdown()
          │
          └── releases them
```

This keeps resource ownership clear.

If a provider creates a worker, that provider should generally be responsible for closing the worker.

If a provider creates a subscription, it should generally be responsible for removing the subscription.

## Provider Context

Lifecycle methods receive the shared `PhestusContext`.

```ts
export interface PhestusContext {
    service: PhestusService;
    logger: Logger;
    eventBus: EventBus;
}
```

The context provides three primary pieces of shared infrastructure.

### Service

The service provides access to the application's service abstraction:

```ts
context.service
```

Providers can use this when their implementation needs application data or other service capabilities.

### Logger

The logger provides the runtime logging interface:

```ts
context.logger.info(
    "Provider initialized",
);
```

Providers should use the provided logger rather than creating their own application-wide logging system.

### Event Bus

The event bus provides access to the application's event infrastructure:

```ts
context.eventBus
```

A provider can use it when its implementation needs to publish or subscribe to application events.

## Dependencies

Providers can declare dependencies:

```ts
dependencies?: PhestusDependency[];
```

The dependency structure is shared across the Phestus ecosystem:

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

This allows providers to describe what they require from the runtime.

## Module Dependencies

A provider can depend on a module:

```ts
dependencies = [
    {
        type: "module",
        slug: "queue",
        version: "0.1.0",
    },
];
```

This is useful when the provider is tightly associated with a specific module capability.

For example:

```text
BullMQ Provider
      │
      └── requires Queue Module
```

## Provider Dependencies

A provider can also depend on another provider:

```ts
dependencies = [
    {
        type: "provider",
        slug: "redis",
        version: "0.1.0",
    },
];
```

This can be useful when one implementation relies on another provider's infrastructure.

For example:

```text
Storage Provider
      │
      └── Redis Provider
```

The dependency system allows this relationship to be explicitly described.

## Plugin Dependencies

Providers may also declare a plugin dependency:

```ts
dependencies = [
    {
        type: "plugin",
        slug: "some-plugin",
        version: "0.1.0",
    },
];
```

This should be used when the provider specifically requires functionality supplied by another plugin.

## Optional Dependencies

Dependencies can be optional:

```ts
dependencies = [
    {
        type: "provider",
        slug: "metrics",
        version: "0.1.0",
        optional: true,
    },
];
```

An optional dependency indicates that the provider can operate without that component.

This allows providers to support additional integrations without making those integrations mandatory.

For example:

```text
Provider
   │
   ├── Core implementation
   │
   └── Optional metrics provider
```

The core provider can continue operating when metrics are not installed.

## Version Requirements

Dependencies include a version:

```ts
{
    type: "provider",
    slug: "redis",
    version: "0.1.0",
}
```

This communicates the provider version expected by the implementation.

Provider authors should declare the version requirement that their implementation was designed against.

## Lifecycle and Dependencies

Dependencies are particularly important when providers participate in initialization and shutdown.

Conceptually, a provider should not attempt to use a dependency before that dependency is available.

For example:

```text
Redis Provider
      │
      ▼
Queue Provider
```

The Queue Provider depends on Redis infrastructure.

The dependency relationship provides the runtime with information about that relationship before lifecycle operations occur.

This is one of the reasons dependencies are declared as metadata rather than hidden inside provider implementation code.

## Lifecycle Example

Consider a provider that creates an external client:

```ts
export class ExampleProvider {
    slug = "example";
    name = "Example Provider";
    moduleSlug = "example";
    version = "0.1.0";

    private client?: ExampleClient;

    async initialize(
        context: PhestusContext,
    ): Promise<void> {
        this.client =
            new ExampleClient();

        context.logger.info(
            "Example provider initialized",
        );
    }

    async shutdown(
        context: PhestusContext,
    ): Promise<void> {
        await this.client?.close();

        this.client = undefined;

        context.logger.info(
            "Example provider shutdown",
        );
    }
}
```

The lifecycle is straightforward:

```text
Phestus starts
     │
     ▼
initialize()
     │
     ▼
create resources
     │
     ▼
provider operates
     │
     ▼
shutdown()
     │
     ▼
release resources
```

## Designing Lifecycle Methods

Lifecycle methods should generally be:

* deterministic
* asynchronous when external resources are involved
* safe to call as part of application startup or shutdown
* responsible only for provider-owned resources

Avoid placing normal provider operations inside `initialize()` simply because they can technically be executed there.

Initialization should prepare the provider.

Normal operations should happen when the module invokes the provider.

Similarly, shutdown should release resources rather than perform unrelated application work.

## A Provider's Responsibility

A provider is responsible for translating a module capability into a concrete implementation.

Its lifecycle is therefore focused on making that implementation available and maintaining it while the runtime is active.

```text
                 Phestus
                    │
                    ▼
                 Module
                    │
              capability
                    │
                    ▼
                 Provider
              ┌─────┴─────┐
              │           │
         initialize    shutdown
              │           │
              ▼           ▼
          resources    cleanup
```

This gives providers a predictable place to integrate external systems while keeping those implementation details outside of modules.
