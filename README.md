# Phestus Architecture

## Composable, Modular, and Extensible by Design

Phestus is designed around a simple idea:

> **Businesses should own their software, not rent a collection of disconnected features forever.**

The goal of Phestus is to provide a powerful, customizable commerce and business platform that can scale from an individual business to complex enterprise use cases without forcing every customer into the same architecture or feature set.

Phestus is built on top of [PayloadCMS](https://payloadcms.com/) and extends it with a composable system of **Modules, Providers, and Plugins**.

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
````

Over time, changing one part of the system can require changes throughout the entire application.

Phestus takes a different approach.

Instead of building one massive application, functionality is separated into independent, composable components.

```text
                  Phestus
                     │
          ┌──────────┼──────────┐
          │          │          │
       Modules    Modules    Modules
          │          │          │
       Providers  Providers  Providers
          │
       Plugins
```

Each component has a specific responsibility and communicates through well-defined interfaces.

This allows Phestus to evolve without requiring the entire platform to evolve with it.

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

### Examples

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
```

Modules should represent meaningful business capabilities rather than specific technologies.

---

# Providers

## Providers Implement Capabilities

A **Provider** is an implementation of a Module.

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

This keeps the application independent from the underlying service.

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

PayloadCMS
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

PayloadCMS
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

PayloadCMS
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

### Business Logic

Businesses should be able to define their own:

* Workflows
* Automations
* Pricing rules
* Fulfillment logic
* Notifications
* Integrations
* Business processes

### Infrastructure

Businesses should be able to choose their own:

* Payment providers
* Shipping providers
* Tax providers
* Email providers
* SMS providers
* Storage providers
* Search providers
* ERP integrations

### Extensions

Developers should be able to create:

* Custom Modules
* Custom Providers
* Custom Plugins
* Custom Workflows
* Custom integrations

The platform should provide the foundation without unnecessarily restricting how the foundation is used.

---

# Built on PayloadCMS

Phestus is built on top of **PayloadCMS**.

Payload provides the underlying CMS and application foundation, while Phestus provides the additional architecture and business capabilities required to build a complete commerce and business platform.

Conceptually:

```text
┌─────────────────────────────────────┐
│               Phestus               │
│                                     │
│  Commerce • Modules • Providers     │
│  Plugins • Workflows • Events       │
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

Payload acts as the foundation and source of truth for much of the application, while Phestus builds a composable business platform around it.

This allows Phestus to take advantage of the flexibility of Payload without forcing every business capability directly into the CMS layer.

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

without turning the platform into an increasingly coupled codebase.

The architecture should allow new capabilities to be added without requiring existing components to understand their implementation.

For example:

```text
Today:

Payment
 └── Stripe


Tomorrow:

Payment
 ├── Stripe
 ├── Airwallex
 ├── PayPal
 └── Custom Provider
```

The Payment Module does not need to change simply because another provider exists.

That is the core benefit of the architecture.

---

# Core Principles

Phestus is built around several principles.

### 1. Capabilities over Implementations

Modules define capabilities.

Providers implement those capabilities.

The rest of the platform should depend on the capability rather than the implementation.

---

### 2. Loose Coupling

Components should communicate through contracts and interfaces rather than direct implementation dependencies.

---

### 3. Composability

Businesses should be able to combine components to create the platform they actually need.

---

### 4. Extensibility

Developers should be able to extend Phestus without modifying the core platform whenever possible.

---

### 5. Provider Agnosticism

Business logic should not be tightly coupled to third-party services.

---

### 6. Explicit Dependencies

Components should clearly define what they depend on so the platform can resolve and manage those dependencies.

---

### 7. Customer Ownership

The platform should favor software ownership and extensibility over forcing customers into a fixed collection of recurring SaaS features.

---

### 8. Progressive Complexity

A simple business should be able to run a simple Phestus installation.

A complex business should be able to progressively add modules, providers, plugins, workflows, and custom integrations as needed.

---

# The End Goal

Phestus is intended to become a **composable business platform**.

Instead of providing one rigid application, Phestus provides a foundation from which different businesses can construct their own systems.

The architecture can be summarized as:

```text
                    Phestus
                       │
                 ┌─────┴─────┐
                 │   Plugin  │
                 │   System  │
                 └─────┬─────┘
                       │
              Manages & Extends
                       │
                 ┌─────┴─────┐
                 │  Modules  │
                 └─────┬─────┘
                       │
                Define Capabilities
                       │
                 ┌─────┴─────┐
                 │ Providers │
                 └─────┬─────┘
                       │
                Implement Capabilities
                       │
                 ┌─────┴─────┐
                 │ Services  │
                 │  Stripe   │
                 │  Resend   │
                 │  Shippo   │
                 │   etc.    │
                 └───────────┘
```

The objective is not to build the biggest monolithic platform.

The objective is to build a **foundation that can become whatever a business needs it to be.**

Phestus should provide the primitives, architecture, and tooling necessary for businesses and developers to build their own systems on top of it.