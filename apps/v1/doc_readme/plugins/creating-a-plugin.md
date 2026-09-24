---
title: Creating a Plugin
description: A walkthrough of how to create a plugin and how to integrate it into your project
tags:
  - phestus
  - plugins
  - introduction
  - web stack
  - web framework
  - modular
order: 2
---

# Creating a Plugin

A plugin is created by implementing the `PhestusPlugin` interface and defining its manifest, modules, providers, and optional lifecycle hooks.

A minimal plugin looks like this:

```ts
import type {
    PhestusPlugin,
} from "@phestus/sdk";

export const examplePlugin: PhestusPlugin = {
    manifest: {
        slug: "example",
        name: "Example Plugin",
        version: "0.1.0",
        provides: [],
    },
};
```

The plugin can then be registered with Phestus:

```ts
const phestus = new Phestus({
    plugins: [
        examplePlugin,
    ],

    service,
    logger,
    eventBus,
});
```

## 1. Create the Manifest

Every plugin must define a manifest.

```ts
manifest: {
    slug: "example",
    name: "Example Plugin",
    version: "0.1.0",
    provides: [],
}
```

The manifest contains:

| Property       | Description                                       |
| -------------- | ------------------------------------------------- |
| `slug`         | Unique identifier for the plugin                  |
| `name`         | Human-readable plugin name                        |
| `version`      | Plugin version                                    |
| `provides`     | Capabilities implemented by the plugin            |
| `dependencies` | Optional plugin, module, or provider dependencies |

The `slug`, `name`, and `version` are required.

## 2. Add a Provider

Most plugins exist to package a provider for an existing module.

For example, suppose the `event` module defines event functionality and a provider implements it.

The provider can be included in the plugin:

```ts
import type {
    PhestusPlugin,
} from "@phestus/sdk";

const examplePlugin: PhestusPlugin = {
    manifest: {
        slug: "example-events",
        name: "Example Events",
        version: "0.1.0",

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
};
```

The important part is the relationship between the module and provider:

```ts
{
    moduleSlug: "event",
    providerSlug: "example",
}
```

This tells Phestus that the `example` provider implements the `event` module.

## 3. Add a Module

A plugin can also provide modules.

```ts
const examplePlugin: PhestusPlugin = {
    manifest: {
        slug: "example",
        name: "Example Plugin",
        version: "0.1.0",

        provides: [
            {
                moduleSlug: "example",
                providerSlug: "example",
            },
        ],
    },

    modules: [
        exampleModule,
    ],

    providers: [
        exampleProvider,
    ],
};
```

This pattern is useful when the plugin introduces a completely new capability.

The module defines the capability:

```text
example module
```

while the provider implements it:

```text
example provider
```

The plugin packages both together.

## 4. Declare Capabilities

Every plugin must define a `provides` array.

```ts
provides: [
    {
        moduleSlug: "event",
        providerSlug: "redis",
    },
],
```

A capability connects exactly one module to one provider.

```ts
interface PluginCapability {
    moduleSlug: string;
    providerSlug: string;
}
```

The module must exist either:

* In the plugin's `modules` array
* Or as a module already registered with Phestus

The provider must be included by the plugin.

For example:

```ts
provides: [
    {
        moduleSlug: "event",
        providerSlug: "redis",
    },
],
```

requires a provider with the corresponding `redis` slug and an `event` module.

## 5. Add Dependencies

Plugins can declare dependencies on other plugins, modules, or providers.

```ts
dependencies: [
    {
        type: "module",
        slug: "event",
        version: "0.1.0",
    },
],
```

A dependency contains:

```ts
{
    type: "module",
    slug: "event",
    version: "0.1.0",
}
```

The supported dependency types are:

```ts
"plugin"
"module"
"provider"
```

Dependencies allow a plugin to explicitly describe the components it requires.

For example, a provider plugin may depend on the module whose capability it implements:

```ts
const examplePlugin: PhestusPlugin = {
    manifest: {
        slug: "example-events",
        name: "Example Events",
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
};
```

## 6. Add Lifecycle Hooks

Plugins can execute code when Phestus initializes and shuts down.

```ts
const examplePlugin: PhestusPlugin = {
    manifest: {
        slug: "example",
        name: "Example Plugin",
        version: "0.1.0",
        provides: [],
    },

    async initialize(context) {
        context.logger.info(
            "Example plugin initialized.",
        );
    },

    async shutdown(context) {
        context.logger.info(
            "Example plugin shut down.",
        );
    },
};
```

The lifecycle context provides access to the shared Phestus runtime context.

```ts
interface PhestusContext {
    service?: unknown;
    logger: Logger;
    eventBus: EventBus;
}
```

Lifecycle hooks should be used for plugin-level startup and shutdown behavior.

## 7. Register the Plugin

Once the plugin is complete, pass it to the `Phestus` configuration:

```ts
const phestus = new Phestus({
    plugins: [
        examplePlugin,
    ],

    service,
    logger,
    eventBus,
});
```

Phestus registers the plugin and then registers the modules and providers supplied by that plugin.

This means the application does not need to separately register the plugin's components:

```ts
// Not required for components owned by the plugin.

modules: [
    exampleModule,
],

providers: [
    exampleProvider,
],
```

Instead, the plugin acts as the registration boundary:

```ts
plugins: [
    examplePlugin,
],
```

## Complete Example

The following example combines the pieces:

```ts
import type {
    PhestusPlugin,
} from "@phestus/sdk";

import {
    exampleModule,
} from "./example-module";

import {
    exampleProvider,
} from "./example-provider";

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
                moduleSlug: "example",
                providerSlug: "example",
            },
        ],
    },

    modules: [
        exampleModule,
    ],

    providers: [
        exampleProvider,
    ],

    async initialize(context) {
        context.logger.info(
            "Example plugin initialized.",
        );
    },

    async shutdown(context) {
        context.logger.info(
            "Example plugin shut down.",
        );
    },
};
```

Register it with Phestus:

```ts
const phestus = new Phestus({
    plugins: [
        examplePlugin,
    ],

    service,
    logger,
    eventBus,
});
```

The resulting structure is:

```text
Phestus
└── Example Plugin
    ├── Example Module
    ├── Example Provider
    ├── Dependencies
    └── Lifecycle
```

The plugin is now responsible for composing and distributing those components as a single unit.
