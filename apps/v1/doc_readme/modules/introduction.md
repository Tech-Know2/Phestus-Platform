---

title: Introduction
order: 1
---

## What is a Module?

A module is a core component of the Phestus Platform. It defines an abstract interface for a specific area of functionality, such as payments, notifications, events, queues, or jobs.

A module is responsible for defining **what a capability does**, rather than **how it is implemented**.

This separation allows the underlying implementation to be provided independently while the rest of the application interacts with a consistent interface.

A module defines:
* The functionality it provides
* The functions and interfaces available to other parts of the platform
* The expected inputs and return types
* Its name, slug, and version
* Its dependencies
* Whether it requires or supports providers
* Its initialization and shutdown lifecycle

For example, a payment module might define operations such as creating a payment or refunding a transaction without requiring the module itself to know whether Stripe, Airwallex, or another service performs the actual operation.

## Defining a Module

Defining a module is intentionally simple. A module implements the `PhestusModule` interface provided by the `@phestus/sdk` package.

```ts
export interface PhestusModule {
    manifest: ModuleManifest;

    initialize?(context: PhestusContext): Promise<void>;

    shutdown?(context: PhestusContext): Promise<void>;
}
```

Every module provides a `manifest` that describes the module to the Phestus runtime.

The manifest is defined as:

```ts
export interface ModuleManifest {
    slug: string;
    name: string;
    version: string;
    dependencies?: PhestusDependency[];
    provider?: {
        required?: boolean;
        multiple?: boolean;
    };
}
```

The `slug`, `name`, and `version` identify the module, while the remaining properties describe how it interacts with the rest of the platform.

### Module Lifecycle

Modules can optionally implement two lifecycle methods:

* `initialize()` - called when the module is being started.
* `shutdown()` - called when the module is being stopped.

Both methods receive a `PhestusContext`, giving the module access to the services and runtime functionality it needs.

This allows modules to perform setup and cleanup without requiring the application to manage those details directly.

## Module Dependencies

Modules can depend on other modules, plugins, or providers.

Dependencies are defined using `PhestusDependency`:

```ts
export interface PhestusDependency {
    type: "plugin" | "module" | "provider";
    slug: string;
    version: string;
    optional?: boolean;
}
```

Each dependency specifies:

* `type` - the type of component being depended upon.
* `slug` - the identifier of the dependency.
* `version` - the required dependency version.
* `optional` - whether the dependency is optional.

For example, a workflow module might depend on the queue, event, and job modules that provide the capabilities required to execute workflows.

The Phestus runtime can use these declarations to understand the relationships between components and initialize them in the appropriate order.

## Providers

Providers are the implementation layer behind a module.

While a module defines **what functionality is available**, a provider defines **how that functionality is implemented**.

For example, an event module can define the interface for publishing and subscribing to events, while a provider can implement that interface using Redis, another message broker, or a different backend.

This keeps modules independent from specific technologies.

A module can declare whether a provider is required and whether multiple providers can be configured:

```ts
provider?: {
    required?: boolean;
    multiple?: boolean;
};
```

For example:
* `required: true` means the module cannot operate without a provider.
* `multiple: true` means the module can support multiple providers.

This allows the same module to be used across different applications and infrastructure without changing the module's public interface.

## The Module Architecture

The relationship can be summarized as:

```text
Module
    │
    ├── Defines capabilities
    ├── Defines interfaces
    ├── Defines lifecycle
    ├── Declares dependencies
    │
    └── Providers
            │
            └── Implement those capabilities
```

This separation is one of the fundamental ideas behind Phestus.

Modules provide a stable interface for application functionality, while providers allow the implementation to change independently. Plugins can then package and manage modules and providers as installable components.

As a result, a Phestus application can be assembled from interchangeable components without requiring the core application to be tightly coupled to a particular service or technology.
