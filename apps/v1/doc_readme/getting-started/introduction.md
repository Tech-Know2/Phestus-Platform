---
title: Introduction
description: An introduction into Phestus and its capabilities as a web stack
tags:
  - phestus
  - introduction
  - web stack
  - web framework
  - modular
order: 1
---

## What is Phestus?

Phestus is a modular application platform designed to give developers a flexible foundation for building modern web applications and services.

Rather than providing one large, opinionated framework, Phestus is built around a collection of **modules, providers, and plugins** that can be combined to create the infrastructure your application needs.

The goal is simple: **give you the building blocks without forcing you into a specific architecture.**

Phestus can be used to build anything from a traditional web application to a fully customizable CMS, commerce platform, background processing system, or complex business application.

## What Can Phestus Do?

Phestus provides infrastructure for common application concerns while keeping those concerns modular.

Some of the core capabilities include:

* **Data & Schemas** - Define application data structures and interact with them through a consistent service interface.
* **Events** - Publish and subscribe to application events without coupling business logic to a specific transport.
* **Queues** - Execute asynchronous work through queue providers such as BullMQ.
* **Jobs** - Define and execute background jobs using the queue infrastructure.
* **Workflows** - Build multi-step business processes that coordinate jobs, events, and application logic.
* **Plugins** - Extend Phestus with additional modules and providers.
* **Providers** - Connect Phestus capabilities to concrete technologies and services.
* **Modules** - Organize application capabilities into reusable, independent pieces.

Because these systems are separated from their underlying implementations, you can change the technology behind a capability without rewriting the application that uses it.

For example, an application can use the Phestus Queue module while the actual queue implementation is provided by BullMQ. A different provider could be introduced later without changing the application's queue-facing code.

## Built to Be Extended

One of the core ideas behind Phestus is that your application should not have to depend directly on every infrastructure technology it uses.

**Modules define capabilities. Providers implement them. Plugins package and distribute them.**

This creates a system where infrastructure can be replaced, extended, or composed as your application grows.

For example, a project could start with:

```text
Phestus
├── Event
├── Queue
├── Job
└── Workflow
```

and later add capabilities such as:

```text
├── Authentication
├── Payments
├── Storage
├── Email
├── Search
├── CMS
└── Analytics
```

These capabilities can be developed independently and installed only when they are needed.

## A Foundation, Not a Finished Application

Phestus is intentionally not a single-purpose application.

It is a **foundation for building applications**.

You can use its modules independently, combine them into a larger platform, or create your own modules and providers to fit the requirements of your project.

This makes Phestus suitable for projects ranging from small applications to large systems with complex business logic and background processing.

## Where to Go Next

If you are new to Phestus, the recommended path is:

1. **Install Phestus** and create your first project.
2. **Learn about Modules** to understand how application capabilities are organized.
3. **Learn about Providers** to understand how infrastructure implementations are connected.
4. **Explore the Service** to learn how Phestus handles data and schemas.
5. **Explore Events, Jobs, Queues, and Workflows** to start building asynchronous and event-driven applications.

From there, you can begin composing Phestus into the architecture that makes sense for your application.
