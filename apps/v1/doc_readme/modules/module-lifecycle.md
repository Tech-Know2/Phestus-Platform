---
title: Module Lifecycle
description: This is a doc describing the initialization and shutdown lifecycle of modules within the Phestus platform.
tags:
 - phestus
 - modules
 - lifecycle
 - initialization
 - shutdown
 - web stack
 - web framework
 - modular
order: 4
---

## Module Lifecycle

Phestus modules can participate in the application lifecycle through two optional methods: `initialize` and `shutdown`.

```ts id="b1r7x8"
export interface PhestusModule {
  manifest: ModuleManifest;

  initialize?(context: PhestusContext): Promise<void>;
  shutdown?(context: PhestusContext): Promise<void>;
}
```

These methods allow a module to perform setup when Phestus starts and cleanup when Phestus shuts down.

## Initialization

The `initialize` method is called when the module is initialized by the Phestus runtime.

```ts id="7gq3c1"
const module: PhestusModule = {
  manifest: {
    slug: 'example',
    name: 'Example Module',
    version: '1.0.0',
  },

  async initialize(context) {
    // Module initialization
  },
}
```

Initialization can be used for tasks such as:

* Registering resources
* Ensuring required schemas exist
* Subscribing to events
* Setting up module-specific state
* Performing other startup configuration

The module receives a `PhestusContext` containing the services available to it.

## Phestus Context

The context provided to lifecycle methods contains the core services available to a module:

```ts id="z3r5p2"
export interface PhestusContext {
  service: PhestusService;
  logger: Logger;
  eventBus: EventBus;
}
```

### Service

`service` provides access to the configured Phestus service.

```ts id="n0p7cd"
await context.service.schema.ensure(
  'example',
  schema,
)
```

Modules can use the service for operations such as schema management and data management without directly depending on a specific implementation.

### Logger

`logger` provides the module with access to the application's logging system.

```ts id="6j5f4w"
context.logger.info('Example module initialized')
```

The logger allows module activity to use the same logging infrastructure as the rest of the application.

### Event Bus

`eventBus` provides access to Phestus event communication.

```ts id="m8x2q4"
await context.eventBus.subscribe(
  'example.created',
  async (event) => {
    // Handle event
  },
)
```

Modules can use the event bus to communicate with other parts of the application without creating direct dependencies between implementations.

## Shutdown

The `shutdown` method is called when the module is being shut down.

```ts id="p4s9k2"
const module: PhestusModule = {
  manifest: {
    slug: 'example',
    name: 'Example Module',
    version: '1.0.0',
  },

  async shutdown(context) {
    // Module cleanup
  },
}
```

Shutdown can be used to clean up resources created during initialization, such as:

* Event subscriptions
* Connections
* Timers
* Workers
* Other module-specific resources

For example:

```ts id="c7v1m5"
let unsubscribe: (() => Promise<void>) | undefined

const module: PhestusModule = {
  manifest: {
    slug: 'example',
    name: 'Example Module',
    version: '1.0.0',
  },

  async initialize(context) {
    unsubscribe = await context.eventBus.subscribe(
      'example.created',
      async (event) => {
        // Handle event
      },
    )
  },

  async shutdown() {
    await unsubscribe?.()
  },
}
```

## Optional Lifecycle Methods

Both lifecycle methods are optional.

A module that does not require startup or shutdown behavior does not need to implement either method:

```ts id="h2w6n9"
const module: PhestusModule = {
  manifest: {
    slug: 'example',
    name: 'Example Module',
    version: '1.0.0',
  },
}
```

This allows modules to remain lightweight when they only provide definitions or capabilities that do not require runtime setup.

## Lifecycle and Dependencies

A module's manifest can declare dependencies on other Phestus components.

```ts id="r5k8w2"
const module: PhestusModule = {
  manifest: {
    slug: 'example',
    name: 'Example Module',
    version: '1.0.0',
    dependencies: [
      {
        type: 'module',
        slug: 'queue',
        version: '1.0.0',
      },
    ],
  },

  async initialize(context) {
    // Module initialization
  },
}
```

Dependencies describe what a module requires to operate. The Phestus runtime is responsible for managing the module lifecycle and its dependencies.

This allows modules to focus on their own initialization and shutdown behavior rather than managing the lifecycle of other modules.

## Lifecycle Overview

The module lifecycle can be summarized as:

```text
Phestus starts
      ↓
Dependencies resolved
      ↓
Module initialized
      ↓
initialize(context)
      ↓
Module running
      ↓
shutdown(context)
      ↓
Module stopped
```

The lifecycle provides a consistent way for modules to start, operate, and clean up while remaining independent of the underlying application infrastructure.
