# Phestus Architecture

## Composable, Modular, and Extensible by Design

Phestus is designed around a simple idea:

> **Businesses should own their software, not rent a collection of disconnected features forever.**

The goal of Phestus is to provide a powerful, customizable business platform that can scale from an individual business to complex enterprise use cases without forcing every customer into the same architecture or feature set.

Phestus is built around a composable system of **Services, Modules, Providers, and Plugins**.

Each component has a specific responsibility and communicates through well-defined interfaces.

```text
                         Phestus

                            │
             ┌──────────────┼──────────────┐
             │              │              │
          Services        Modules        Plugins
             │              │              │
             │          Providers          │
             │              │              │
             └──────────────┴──────────────┘
```

This allows Phestus to evolve without requiring the entire platform to evolve with it.

---

# Design Philosophy

Traditional platforms tend to grow into large, tightly coupled applications.

As more features are added, individual systems become increasingly dependent on one another:

```text
Commerce

 ├── Payments

 ├── Inventory

 ├── Shipping

 ├── Notifications

 ├── Tax

 └── etc...
```

Over time, changing one part of the system can require changes throughout the entire application.

Phestus takes a different approach.

Instead of building one massive application, functionality is separated into independent, composable components.

The core architectural boundaries are:

```text
Service
   │
   │ Provides data and backend capabilities
   ▼
Modules
   │
   │ Define application capabilities
   ▼
Providers
   │
   │ Implement infrastructure
   ▼
Plugins
   │
   │ Package, configure, and manage components
   ▼
Phestus Runtime
```

Each component has a specific responsibility and communicates through contracts.

---

# Services

## Services Provide the Backend

A **PhestusService** provides the data and schema operations that Phestus expects from an application backend.

Phestus does not need to depend directly on a specific CMS, database, or API system.

Instead, a service implements the `PhestusService` interface and translates Phestus operations into the backend's native API.

```text
                    Phestus

                       │
                       │ PhestusService
                       ▼

          ┌────────────┼────────────┐
          │            │            │
       Payload       Sanity       Custom
       Service       Service      Service
```

For example:

```ts
class PhestusPayload implements PhestusService {
    // Payload implementation
}
```

Phestus modules can then interact with the service without knowing which backend is being used.

```ts
const result = await context.service.find("products", {
    where: {
        fields: {
            status: {
                equals: "active",
            },
        },
    },
});
```

A Payload service could translate this into a Payload query, while a Sanity service could translate the same query into GROQ.

The module only depends on the Phestus contract.

---

# Data Operations

The service provides backend-independent CRUD operations.

## Find

```ts
await service.find("products");
```

## Find with a Query

```ts
await service.find("products", {
    where: {
        fields: {
            status: {
                equals: "active",
            },
        },
    },
    limit: 20,
});
```

## Find by ID

```ts
await service.findById(
    "products",
    "123",
);
```

## Count

```ts
await service.count("products", {
    where: {
        fields: {
            status: {
                equals: "active",
            },
        },
    },
});
```

## Create

```ts
await service.create(
    "products",
    {
        name: "Example Product",
        price: 100,
    },
);
```

## Update

```ts
await service.update(
    "products",
    "123",
    {
        price: 150,
    },
);
```

## Delete

```ts
await service.delete(
    "products",
    "123",
);
```

---

# Phestus Queries

Phestus queries are backend-independent.

A service implementation is responsible for translating the query into the native query language of the backend.

## Field Conditions

```ts
{
    where: {
        fields: {
            status: {
                equals: "active",
            },
            price: {
                greaterThan: 100,
            },
        },
    },
}
```

## Available Operators

```text
equals
notEquals
contains
startsWith
endsWith
greaterThan
greaterThanOrEqual
lessThan
lessThanOrEqual
in
notIn
exists
```

For example:

```ts
{
    where: {
        fields: {
            title: {
                contains: "shirt",
            },
            price: {
                lessThanOrEqual: 100,
            },
            category: {
                in: [
                    "clothing",
                    "accessories",
                ],
            },
        },
    },
}
```

## AND

```ts
{
    where: {
        and: [
            {
                fields: {
                    status: {
                        equals: "active",
                    },
                },
            },
            {
                fields: {
                    price: {
                        greaterThan: 100,
                    },
                },
            },
        ],
    },
}
```

## OR

```ts
{
    where: {
        or: [
            {
                fields: {
                    status: {
                        equals: "active",
                    },
                },
            },
            {
                fields: {
                    status: {
                        equals: "pending",
                    },
                },
            },
        ],
    },
}
```

## NOT

```ts
{
    where: {
        not: {
            fields: {
                status: {
                    equals: "deleted",
                },
            },
        },
    },
}
```

## Sorting

```ts
{
    sort: "-createdAt",
}
```

Multiple fields:

```ts
{
    sort: [
        "-createdAt",
        "name",
    ],
}
```

A leading `-` indicates descending order.

## Pagination

```ts
{
    limit: 20,
    offset: 0,
}
```

## Selecting Fields

```ts
{
    select: [
        "id",
        "name",
        "price",
    ],
}
```

## Combined Query

```ts
const products = await service.find<Product>(
    "products",
    {
        where: {
            fields: {
                status: {
                    equals: "active",
                },
                price: {
                    greaterThan: 50,
                },
            },
        },
        sort: "-createdAt",
        limit: 20,
        offset: 0,
        select: [
            "id",
            "name",
            "price",
        ],
    },
);
```

---

# Schemas

The service layer is also responsible for managing the schemas required by Phestus modules.

This allows modules to define the data structures they require without depending on Payload, Sanity, Directus, SQL, MongoDB, or another backend.

```text
Phestus Module
      │
      │ PhestusSchema
      ▼
PhestusService
      │
      ▼
Backend Schema
      │
      ├── Payload Collection
      ├── Sanity Type
      ├── Directus Collection
      └── Custom Database Schema
```

A module defines **what its data should look like**.

The service determines **how that structure is represented by the backend**.

---

# Phestus Schemas

A schema is a backend-independent description of a collection or data type.

```ts
const ProductSchema: PhestusSchema = {
    slug: "products",
    name: "Products",
    version: "0.1.0",

    fields: {
        id: {
            type: "string",
            required: true,
            unique: true,
        },

        name: {
            type: "string",
            required: true,
        },

        price: {
            type: "number",
            required: true,
        },

        description: {
            type: "text",
        },

        active: {
            type: "boolean",
            default: true,
        },
    },

    options: {
        timestamps: true,
    },
};
```

Schemas provide a common representation of application data structures across different backends.

---

# Schema Field Types

Phestus provides backend-independent field types.

```text
string
number
boolean
date
text
email
url
richText
json
array
object
relationship
```

For example:

```ts
const UserSchema: PhestusSchema = {
    slug: "users",
    name: "Users",
    version: "0.1.0",

    fields: {
        name: {
            type: "string",
            required: true,
        },

        email: {
            type: "email",
            required: true,
            unique: true,
        },

        bio: {
            type: "text",
        },

        settings: {
            type: "json",
        },

        active: {
            type: "boolean",
            default: true,
        },
    },
};
```

---

# Relationships

Schemas can define relationships between collections.

```ts
const OrderSchema: PhestusSchema = {
    slug: "orders",
    name: "Orders",
    version: "0.1.0",

    fields: {
        customer: {
            type: "relationship",

            relation: {
                collection: "users",
            },
        },

        total: {
            type: "number",
            required: true,
        },
    },
};
```

Relationships can also represent multiple records:

```ts
products: {
    type: "relationship",

    relation: {
        collection: "products",
        many: true,
    },
},
```

The service determines how the relationship is represented by the underlying backend.

---

# Nested Objects

Schemas can define structured objects.

```ts
const SettingsSchema: PhestusSchema = {
    slug: "settings",
    name: "Settings",
    version: "0.1.0",

    fields: {
        name: {
            type: "string",
            required: true,
        },

        metadata: {
            type: "object",

            fields: {
                theme: {
                    type: "string",
                },

                notifications: {
                    type: "boolean",
                },
            },
        },
    },
};
```

---

# Arrays

Arrays can define the type of their items.

```ts
tags: {
    type: "array",

    items: {
        type: "string",
    },
},
```

This allows schemas to express structured data without depending on a specific backend's field syntax.

---

# Validation

Fields can define common validation rules.

```ts
const ProductSchema: PhestusSchema = {
    slug: "products",
    name: "Products",
    version: "0.1.0",

    fields: {
        name: {
            type: "string",
            required: true,

            validation: {
                minLength: 3,
                maxLength: 100,
            },
        },

        price: {
            type: "number",

            validation: {
                min: 0,
                max: 100000,
            },
        },
    },
};
```

The service translates these validation rules into the capabilities supported by the underlying backend.

---

# Schema Management

Schemas are accessed through `service.schema`.

```ts
interface PhestusSchemaService {
    get(
        collection: string,
    ): Promise<PhestusSchema | null>;

    exists(
        collection: string,
    ): Promise<boolean>;

    create(
        collection: string,
        schema: PhestusSchema,
    ): Promise<void>;

    update(
        collection: string,
        schema: PhestusSchema,
    ): Promise<void>;

    ensure(
        collection: string,
        schema: PhestusSchema,
    ): Promise<void>;
}
```

## Get a Schema

```ts
const schema = await service.schema.get(
    "products",
);
```

## Check if a Schema Exists

```ts
const exists = await service.schema.exists(
    "products",
);
```

## Create a Schema

```ts
await service.schema.create(
    "products",
    ProductSchema,
);
```

## Update a Schema

```ts
await service.schema.update(
    "products",
    ProductSchema,
);
```

## Ensure a Schema

Modules will generally use `ensure()` rather than manually checking whether a schema exists.

```ts
await context.service.schema.ensure(
    "products",
    ProductSchema,
);
```

`ensure()` allows the service to determine whether the schema needs to be created or updated.

This keeps backend-specific schema management out of modules.

---

# Modules and Schemas

Modules can define the schemas required for their functionality.

For example, the Job Module may define:

```ts
const JobSchema: PhestusSchema = {
    slug: "jobs",
    name: "Jobs",
    version: "0.1.0",

    fields: {
        id: {
            type: "string",
            required: true,
            unique: true,
        },

        name: {
            type: "string",
            required: true,
        },

        status: {
            type: "string",
            required: true,
            indexed: true,
        },

        attempts: {
            type: "number",
            default: 0,
        },

        payload: {
            type: "json",
        },
    },

    options: {
        timestamps: true,
    },
};
```

The module can then ensure its schema during initialization:

```ts
async initialize(
    context: PhestusContext,
): Promise<void> {
    await context.service.schema.ensure(
        "jobs",
        JobSchema,
    );
}
```

The Job Module does not need to know whether `jobs` is implemented as:

```text
Payload Collection
Sanity Type
Directus Collection
SQL Table
MongoDB Collection
Custom Backend
```

The service handles the translation.

---

# Schema Versioning

Every schema has a version:

```ts
const ProductSchema: PhestusSchema = {
    slug: "products",
    name: "Products",
    version: "0.1.0",

    fields: {
        // ...
    },
};
```

The version allows Phestus to identify the version of a schema expected by a module.

This becomes important when schema migrations are introduced.

```text
Schema v0.1.0
      │
      │ migration
      ▼
Schema v0.2.0
      │
      │ migration
      ▼
Schema v1.0.0
```

For v0.1, schema management and schema versioning are intentionally separate from a full migration system.

A future version of Phestus may provide explicit migration operations for moving existing data and schemas between versions.

---

# Modules

## Modules Define Capabilities

A **Module** defines what the system is capable of doing.

Modules are intentionally provider-agnostic.

For example, the Payment Module defines the concept of making and managing payments without caring which payment processor is being used.

```text
Payment Module

- createPayment()

- capturePayment()

- refundPayment()

- cancelPayment()

- getPayment()
```

The module defines the **capability and contract**, not the implementation.

This allows the rest of Phestus to work with payments without being tightly coupled to Stripe, PayPal, Airwallex, or any other provider.

## Examples

```text
Payment
Inventory
Tax
Shipping
Notification
Storage
Search
Events
Workflows
Jobs
Queues
```

Modules should represent meaningful application or business capabilities rather than specific technologies.

Modules may also define the schemas required by their functionality.

```text
Module
  │
  ├── Capability
  │
  ├── Schema
  │
  └── Lifecycle
```

---

# Providers

## Providers Implement Capabilities

A **Provider** is an implementation of a Module or infrastructure capability.

Where a module defines:

> "What can the system do?"

A provider defines:

> "How does the system do it?"

For example:

```text
Payment Module

      │

      ├── Stripe Provider

      ├── Airwallex Provider

      └── PayPal Provider
```

All providers implement the contract defined by the Payment Module.

The application therefore interacts with:

```ts
paymentModule.createPayment(...)
```

rather than:

```ts
stripe.createPayment(...)
```

This keeps the application independent from the underlying provider.

Providers can be replaced without requiring the rest of the application to change.

---

# Plugins

## Plugins Manage and Extend the System

Plugins sit above Modules and Providers.

A plugin is responsible for integrating functionality into Phestus and managing its lifecycle.

Plugins can:

* Register providers
* Register modules
* Declare dependencies
* Configure modules
* Configure providers
* Initialize resources
* Clean up resources
* Register hooks
* Register workflows
* Extend the platform
* Add additional business functionality

For example:

```text
Stripe Plugin

     │

     └── Stripe Payment Provider

              │

              └── Payment Module
```

The plugin manages the integration while the module remains responsible for defining the capability.

This creates a clear separation:

```text
Module
    ↓
Defines the capability

Provider
    ↓
Implements the capability

Plugin
    ↓
Installs and manages the implementation
```

---

# Dependency Management

Plugins and modules should be able to declare their dependencies.

For example:

```text
Stripe Plugin

    │

    └── requires Payment Module
```

Or:

```text
Commerce Plugin

    │

    ├── Payment Module

    ├── Inventory Module

    └── Notification Module
```

The platform can then resolve dependencies and initialize components in the correct order.

This allows the system to remain composable as it grows.

A component should not need to know how the entire application is constructed.

It should only need to know what capabilities it depends on.

---

# A Composable Architecture

The goal is to make Phestus behave more like an ecosystem than a monolithic application.

A customer should be able to install only what they need.

For example:

```text
Business A

Phestus

    +

Payload Service

    +

Commerce

    +

Stripe

    +

Resend
```

While another business might use:

```text
Business B

Phestus

    +

Sanity Service

    +

Commerce

    +

Airwallex

    +

Twilio

    +

Shippo
```

And an enterprise customer might build:

```text
Business C

Phestus

    +

Custom Service

    +

Commerce

    +

Custom Payment Provider

    +

Custom ERP Provider

    +

Custom Inventory System

    +

Custom Workflows

    +

Custom Notifications
```

All three systems can be built on the same underlying platform.

---

# Installing Components

Phestus is intended to support a custom CLI for installing and managing components.

Conceptually:

```bash
Phestus install stripe
Phestus install payments
Phestus install shipping
Phestus install shippo
```

The CLI can handle:

* Installing components
* Removing components
* Updating components
* Resolving dependencies
* Managing versions
* Configuring providers
* Enabling/disabling components
* Validating compatibility

The goal is to make extending a Phestus installation feel similar to installing packages in a modern development ecosystem.

---

# One-Time Purchases

Phestus is designed around a different software ownership model.

Rather than requiring customers to subscribe indefinitely to every feature, components can be distributed as **one-time purchases**.

For example:

```text
Phestus

    │

    ├── Core Platform

    │

    ├── Payment Module

    │

    ├── Stripe Plugin

    │

    ├── Shipping Module

    │

    └── Shippo Plugin
```

A customer can purchase the functionality they need and install it into their own Phestus instance.

This creates a system where customers can build their platform over time rather than being forced into a fixed subscription tier.

---

# Customization

Phestus should not assume that every business operates the same way.

The architecture therefore needs to support customization at multiple levels.

## Business Logic

Businesses should be able to define their own:

* Workflows
* Automations
* Pricing rules
* Fulfillment logic
* Notifications
* Integrations
* Business processes

## Infrastructure

Businesses should be able to choose their own:

* Backend services
* Payment providers
* Shipping providers
* Tax providers
* Email providers
* SMS providers
* Storage providers
* Search providers
* ERP integrations

## Extensions

Developers should be able to create:

* Custom Modules
* Custom Providers
* Custom Plugins
* Custom Services
* Custom Schemas
* Custom Workflows
* Custom Integrations

The platform should provide the foundation without unnecessarily restricting how the foundation is used.

---

# Backend Independence

Phestus is designed so that its application architecture does not need to be tied to a single CMS or database.

A backend is accessed through a `PhestusService`.

```text
                 Phestus

                    │

                    │ PhestusService

                    ▼

        ┌───────────┼───────────┐
        │           │           │
     Payload      Sanity      Custom
        │           │           │
        └───────────┼───────────┘
                    │
                    ▼
               Backend
```

This allows the same Phestus modules to operate against different backend implementations.

For example:

```text
@phestus/payload
@phestus/sanity
@phestus/directus
@phestus/custom
```

The service is responsible for translating:

```text
Phestus Query
      │
      ▼
Phestus Service
      │
      ▼
Backend Query
```

and:

```text
Phestus Schema
      │
      ▼
Phestus Service
      │
      ▼
Backend Schema
```

This separation is important because Phestus modules should describe **what they need**, while the service determines **how the backend provides it**.

---

# PayloadCMS

PayloadCMS is one possible backend for Phestus.

A Payload service can provide the `PhestusService` contract by translating Phestus operations into Payload operations.

Conceptually:

```text
┌─────────────────────────────────────┐
│              Phestus                │
│                                     │
│ Modules • Providers • Plugins       │
│ Workflows • Events • Jobs           │
│                                     │
├─────────────────────────────────────┤
│         PhestusService              │
│                                     │
│ Data • Queries • Schemas            │
│                                     │
├─────────────────────────────────────┤
│             PayloadCMS              │
│                                     │
│ Collections • Globals • Auth        │
│ Admin UI • API • Hooks • Database   │
│                                     │
├─────────────────────────────────────┤
│          Infrastructure             │
│                                     │
│ PostgreSQL • Redis • Storage        │
│ Workers • Queues • etc.             │
└─────────────────────────────────────┘
```

Payload can therefore serve as a powerful default backend while remaining an implementation detail of the service layer.

The same Phestus application architecture can theoretically be used with other backends.

---

# Designed to Scale

Scaling Phestus does not simply mean supporting more requests.

It means being able to support:

* More features
* More providers
* More integrations
* More businesses
* More complex workflows
* More customization
* More developers
* More independent components
* More backend implementations

without turning the platform into an increasingly coupled codebase.

The architecture should allow new capabilities to be added without requiring existing components to understand their implementation.

For example:

```text
Today:

Payment

 └── Stripe
```

Tomorrow:

```text
Payment

 ├── Stripe

 ├── Airwallex

 ├── PayPal

 └── Custom Provider
```

The Payment Module does not need to change simply because another provider exists.

Likewise, the application should not need to change simply because the backend changes:

```text
Today:

Phestus
   │
   └── Payload Service
```

Tomorrow:

```text
Phestus
   │
   ├── Payload Service
   ├── Sanity Service
   └── Custom Service
```

That is the core benefit of the architecture.

---

# Core Principles

Phestus is built around several principles.

## 1. Capabilities over Implementations

Modules define capabilities.

Providers implement those capabilities.

The rest of the platform should depend on the capability rather than the implementation.

---

## 2. Backend Independence

Phestus should not unnecessarily depend on a specific CMS, database, or API system.

Services provide the abstraction between Phestus and the underlying backend.

---

## 3. Loose Coupling

Components should communicate through contracts and interfaces rather than direct implementation dependencies.

---

## 4. Composability

Businesses should be able to combine components to create the platform they actually need.

---

## 5. Extensibility

Developers should be able to extend Phestus without modifying the core platform whenever possible.

---

## 6. Provider Agnosticism

Business logic should not be tightly coupled to third-party services.

---

## 7. Explicit Dependencies

Components should clearly define what they depend on so the platform can resolve and manage those dependencies.

---

## 8. Customer Ownership

The platform should favor software ownership and extensibility over forcing customers into a fixed collection of recurring SaaS features.

---

## 9. Progressive Complexity

A simple business should be able to run a simple Phestus installation.

A complex business should be able to progressively add modules, providers, plugins, workflows, and custom integrations as needed.

---

## 10. Backend Translation

Modules and application code should operate using Phestus contracts.

Services translate those contracts into backend-specific implementations.

```text
Phestus Contract
       │
       ▼
Phestus Service
       │
       ▼
Backend Implementation
```

---

# The End Goal

Phestus is intended to become a **composable business platform**.

Instead of providing one rigid application, Phestus provides a foundation from which different businesses can construct their own systems.

The architecture can be summarized as:

```text
                           Phestus

                              │
               ┌──────────────┼──────────────┐
               │              │              │
               ▼              ▼              ▼
           Services        Modules        Plugins
               │              │              │
               │        Define Capabilities  │
               │              │              │
               │              ▼              │
               │         Providers           │
               │              │              │
               │       Implement             │
               │       Capabilities          │
               │              │              │
               └──────────────┼──────────────┘
                              │
                              ▼
                           Runtime
                              │
                              ▼
                           Backend
```

More specifically:

```text
                         Phestus

                            │
                            ▼

                     ┌─────────────┐
                     │   Plugins   │
                     └──────┬──────┘
                            │
                     Manage & Extend
                            │
                            ▼
                     ┌─────────────┐
                     │   Modules   │
                     └──────┬──────┘
                            │
                    Define Capabilities
                            │
                            ▼
                     ┌─────────────┐
                     │  Providers  │
                     └──────┬──────┘
                            │
                   Implement Capabilities
                            │
                            ▼
                     ┌─────────────┐
                     │   Service   │
                     └──────┬──────┘
                            │
                   Data & Schema Access
                            │
                            ▼
                     ┌─────────────┐
                     │   Backend   │
                     └─────────────┘
```

The objective is not to build the biggest monolithic platform.

The objective is to build a **foundation that can become whatever a business needs it to be**.

Phestus should provide the primitives, architecture, and tooling necessary for businesses and developers to build their own systems on top of it.

The core idea is simple:

> **Modules define what Phestus can do.**
>
> **Providers define how capabilities are implemented.**
>
> **Services define how Phestus communicates with the backend.**
>
> **Plugins define how components are packaged, installed, configured, and extended.**
