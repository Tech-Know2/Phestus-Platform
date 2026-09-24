---
title: Plugin Capabilties
description: Documentation on what a plugin is able to do.
tags:
  - phestus
  - plugins
  - introduction
  - web stack
  - web framework
  - modular
order: 3
---
# Plugin Capabilities

A plugin's `provides` declaration describes which providers implement which modules.

This is the mechanism that connects the module abstraction to its concrete provider implementation.

## Module and Provider

Phestus separates a capability from its implementation.

A module defines a capability:

```text
Module
    ↓
Defines what the system can do
```

A provider implements that capability:

```text
Provider
    ↓
Defines how the system does it
```

A plugin connects the two:

```text
Plugin
    ↓
provides
    ↓
Module ← Provider
```

For example:

```ts
provides: [
    {
        moduleSlug: "event",
        providerSlug: "redis",
    },
],
```

This declares:

> The `redis` provider provides the `event` module.

## The `PluginCapability` Type

Capabilities use the following structure:

```ts
interface PluginCapability {
    moduleSlug: string;
    providerSlug: string;
}
```

Both values are required.

### `moduleSlug`

The slug of the module being implemented.

```ts
moduleSlug: "event"
```

The module must either be included in the plugin or already registered with Phestus.

### `providerSlug`

The slug of the provider implementing that module.

```ts
providerSlug: "redis"
```

The provider must be included in the plugin.

## Providing an Existing Module

A plugin commonly provides a provider for a module that already exists.

For example:

```ts
const redisPlugin: PhestusPlugin = {
    manifest: {
        slug: "redis",
        name: "Redis Providers",
        version: "0.1.0",

        provides: [
            {
                moduleSlug: "event",
                providerSlug: "redis",
            },
        ],
    },

    providers: [
        redisProvider,
    ],
};
```

In this case, the plugin does not define the event module.

The module can be registered independently:

```ts
const phestus = new Phestus({
    modules: [
        eventModule,
    ],

    plugins: [
        redisPlugin,
    ],

    service,
    logger,
    eventBus,
});
```

The plugin supplies the implementation while the module remains independent.

## Providing a Module and Provider Together

A plugin can also introduce both sides of the relationship:

```ts
const plugin: PhestusPlugin = {
    manifest: {
        slug: "example",
        name: "Example",
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

This creates a self-contained capability:

```text
Example Plugin
    │
    ├── Example Module
    │
    └── Example Provider
```

## Capability Validation

Phestus validates capability declarations when the plugin is registered.

The declared module must exist.

The declared provider must be included by the plugin.

The provider must also belong to the module named by `moduleSlug`.

For example, this declaration is valid:

```ts
provides: [
    {
        moduleSlug: "event",
        providerSlug: "redis",
    },
],
```

when the provider is defined for the `event` module.

A provider belonging to a different module cannot be declared as an implementation of `event`.

This keeps the module/provider relationship explicit and prevents plugins from declaring invalid capabilities.

## Multiple Capabilities

A plugin can provide multiple module/provider combinations.

```ts
provides: [
    {
        moduleSlug: "event",
        providerSlug: "redis",
    },
    {
        moduleSlug: "queue",
        providerSlug: "bullmq",
    },
],
```

This is useful when a single plugin packages several related implementations.

Each capability remains independently declared:

```text
event  ← redis
queue  ← bullmq
```

## Capability vs Dependency

Capabilities and dependencies serve different purposes.

A dependency describes something the plugin **requires**:

```ts
dependencies: [
    {
        type: "module",
        slug: "event",
        version: "0.1.0",
    },
],
```

A capability describes something the plugin **provides**:

```ts
provides: [
    {
        moduleSlug: "event",
        providerSlug: "redis",
    },
],
```

A plugin may therefore both depend on and provide capabilities:

```text
Plugin
├── Depends on Event Module
└── Provides Redis implementation for Event Module
```

Keeping these concepts separate makes the plugin manifest explicit about what it needs and what it supplies.
