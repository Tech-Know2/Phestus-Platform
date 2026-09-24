---
title: Plugin Dependencies & Lifecycles
description: Documentation on the lifecycles and dependencies of plugins within Phestus 
tags:
  - phestus
  - plugins
  - introduction
  - web stack
  - web framework
  - modular
order: 4
---
# Plugin Dependencies & Lifecycle

Plugins can declare dependencies and participate in the Phestus runtime lifecycle.

Dependencies describe the components required by a plugin, while lifecycle hooks allow a plugin to perform initialization and shutdown work.

## Dependencies

Plugin dependencies are declared in the manifest:

```ts
dependencies: [
    {
        type: "module",
        slug: "event",
        version: "0.1.0",
    },
],
```

A dependency has three required properties:

```ts
{
    type: "module",
    slug: "event",
    version: "0.1.0",
}
```

### Dependency Types

Phestus supports three dependency types:

```ts
type: "plugin"
type: "module"
type: "provider"
```

For example:

```ts
dependencies: [
    {
        type: "plugin",
        slug: "database",
        version: "0.1.0",
    },
    {
        type: "module",
        slug: "event",
        version: "0.1.0",
    },
    {
        type: "provider",
        slug: "redis",
        version: "0.1.0",
    },
],
```

Each dependency identifies the component and the version required by the plugin.

## Why Declare Dependencies?

Dependencies make the requirements of a plugin explicit.

Instead of assuming that another component exists, a plugin can declare the relationship in its manifest:

```ts
dependencies: [
    {
        type: "module",
        slug: "event",
        version: "0.1.0",
    },
],
```

This allows the Phestus runtime to resolve plugin dependencies before execution.

Plugin dependencies are resolved through the plugin resolver and dependency resolver.

## Lifecycle

Plugins can define two lifecycle hooks:

```ts
initialize?(context: PhestusContext): Promise<void>;

shutdown?(context: PhestusContext): Promise<void>;
```

These hooks are optional.

A plugin does not need to implement either hook if it has no plugin-level lifecycle work to perform.

## Initialization

The `initialize` hook runs when the Phestus runtime initializes the plugin.

```ts
const plugin: PhestusPlugin = {
    manifest: {
        slug: "example",
        name: "Example",
        version: "0.1.0",
        provides: [],
    },

    async initialize(context) {
        context.logger.info(
            "Example plugin initialized.",
        );
    },
};
```

The context provides access to shared runtime services:

```ts
context.service
context.logger
context.eventBus
```

Use initialization for work that needs to happen when the plugin becomes active.

For example:

```ts
async initialize(context) {
    context.logger.info(
        "Starting Example Plugin",
    );

    // Plugin initialization work...
}
```

## Shutdown

Plugins can also clean up resources when Phestus shuts down:

```ts
const plugin: PhestusPlugin = {
    manifest: {
        slug: "example",
        name: "Example",
        version: "0.1.0",
        provides: [],
    },

    async shutdown(context) {
        context.logger.info(
            "Example plugin shutting down.",
        );

        // Cleanup work...
    },
};
```

Shutdown is useful for releasing resources created by the plugin during initialization.

Examples include:

* Closing connections
* Stopping background processes
* Removing subscriptions
* Cleaning up plugin-owned resources

## Keeping Lifecycle Work in the Right Place

Plugins should use lifecycle hooks for **plugin-level** behavior.

Modules and providers may have their own lifecycle responsibilities, so a plugin should not use `initialize()` as a replacement for those abstractions.

A useful separation is:

```text
Plugin
└── Coordinates plugin-level lifecycle

Module
└── Owns capability lifecycle

Provider
└── Owns implementation lifecycle
```

This keeps each component responsible for its own behavior.

## Complete Example

```ts
import type {
    PhestusPlugin,
} from "@phestus/sdk";

export const examplePlugin: PhestusPlugin = {
    manifest: {
        slug: "example",
        name: "Example Plugin",
        version: "0.1.0",

        dependencies: [
            {
                type: "module",
                slug: "event",
                version: "0.1.0",
            },
        ],

        provides: [
            {
                moduleSlug: "event",
                providerSlug: "example",
            },
        ],
    },

    providers: [
        exampleProvider,
    ],

    async initialize(context) {
        context.logger.info(
            "Example Plugin initialized.",
        );
    },

    async shutdown(context) {
        context.logger.info(
            "Example Plugin shutting down.",
        );
    },
};
```

The resulting plugin has four responsibilities:

```text
Example Plugin
│
├── Manifest
│   ├── Identity
│   ├── Dependencies
│   └── Capabilities
│
├── Provider
│   └── Example Event Provider
│
├── Initialization
│
└── Shutdown
```

Together, these pieces define the plugin's complete integration with the Phestus runtime.
