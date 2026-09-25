---
title: Introduction to Workers
description: An introduction to workers in Phestus, including their purpose, architecture, capabilities, and lifecycle.
tags:
 - phestus
 - workers
 - architecture
 - core
order: 1
---
# Introduction to Workers

Workers provide a way for Phestus applications to move work outside of the primary application host.

A worker is an independently running Phestus host that exposes a collection of capabilities. Other parts of the application can dispatch requests to those capabilities without needing to know where or how the work is executed.

At a high level, the architecture looks like this:

```text
Phestus Host
     │
     │ dispatch
     ▼
Worker Provider
     │
     │ transport
     ▼
Phestus Worker
     │
     ├── Capability A
     ├── Capability B
     └── Capability C
```

The goal is to make expensive, isolated, or independently scalable work possible without placing everything inside the main application process.

## What Is a Worker?

A worker is represented by the `Worker` interface:

```ts
export interface Worker {
    id: string;
    slug: string;
    capabilities?: string[];
    scope?: WorkerScope;
    status: WorkerStatus;
    metadata?: Record<string, unknown>;
    registeredAt: number;
    lastHeartbeat?: number;
}
```

A worker has an identity, a slug, a collection of capabilities, an optional scope, and a lifecycle status.

For example:

```ts
const worker: Worker = {
    id: "worker-01",
    slug: "email-worker",
    capabilities: [
        "email.send",
        "email.template",
    ],
    status: "active",
    registeredAt: Date.now(),
};
```

The `id` identifies a specific worker instance, while the `slug` identifies what kind of worker it is.

Multiple instances can therefore share the same slug:

```text
email-worker
    ├── worker-01
    ├── worker-02
    └── worker-03
```

This allows worker instances to be scaled independently.

## Worker Capabilities

Workers do not expose arbitrary methods. Instead, they expose capabilities.

A capability implements the following interface:

```ts
export interface WorkerCapability {
    slug: string;

    handle<TRequest, TResponse>(
        request: TRequest,
    ): Promise<TResponse>;
}
```

For example:

```ts
const sendEmail: WorkerCapability = {
    slug: "email.send",

    async handle(request: {
        to: string;
        subject: string;
        body: string;
    }) {
        // Send the email...

        return {
            success: true,
        };
    },
};
```

A request identifies the capability that should handle it:

```ts
const request: WorkerRequest = {
    capability: "email.send",
    payload: {
        to: "user@example.com",
        subject: "Welcome",
        body: "Welcome to Phestus!",
    },
};
```

The worker finds the capability by its slug and passes the request payload to it.

## Worker Scope

Workers can optionally describe what they are intended to handle:

```ts
type WorkerScope = {
    modules?: string[];
    jobs?: string[];
    queues?: string[];
    events?: string[];
};
```

This allows a worker to be associated with particular modules, jobs, queues, or events.

For example:

```ts
const worker: Worker = {
    id: "worker-01",
    slug: "image-worker",
    capabilities: [
        "image.resize",
        "image.optimize",
    ],
    scope: {
        jobs: ["image-processing"],
        queues: ["images"],
    },
    status: "active",
    registeredAt: Date.now(),
};
```

Scope is primarily metadata and routing information. The transport or provider can use it when determining which worker should receive a request.

## Worker Lifecycle

Workers have four possible statuses:

```ts
type WorkerStatus =
    | "starting"
    | "active"
    | "draining"
    | "offline";
```

A typical lifecycle looks like:

```text
starting
   │
   ▼
active
   │
   ▼
draining
   │
   ▼
offline
```

When a worker starts, it registers itself with its transport and becomes available to receive requests.

While running, the worker can send heartbeats so the system knows that it is still alive.

When shutting down, a worker can enter a draining state before eventually going offline.

## Health and Capacity

Workers can also expose health information:

```ts
export interface WorkerHealth {
    status: "healthy" | "degraded" | "unhealthy";
    lastHeartbeat: number;
    uptime?: number;
    activeRequests?: number;
    capacity?: number;
}
```

Capacity information can be represented separately:

```ts
export interface WorkerCapacity {
    concurrency: number;
    active: number;
}
```

This gives a provider enough information to determine whether a worker is available and how much work it can currently accept.

## Why Use Workers?

Workers are useful when work needs to be separated from the primary application process.

Common examples include:

* Image processing
* Email delivery
* Video processing
* Background jobs
* Scheduled work
* Large data processing
* External API synchronization
* Long-running operations
* CPU-intensive tasks

For example, instead of processing an uploaded image directly inside the web application:

```text
Request
   │
   ▼
Web Application
   │
   └── Resize Image
       └── Optimize Image
           └── Store Image
```

The application can dispatch the work:

```text
Request
   │
   ▼
Web Application
   │
   │ dispatch
   ▼
Image Worker
   ├── Resize
   ├── Optimize
   └── Store
```

The application remains responsible for receiving the request, while the worker handles the expensive operation.

## Workers Are Still Phestus Hosts

A worker is not a completely separate runtime.

`PhestusWorker` extends `PhestusHost`:

```ts
export class PhestusWorker extends PhestusHost {
    // ...
}
```

This means a worker can have its own:

* Modules
* Plugins
* Service
* Logger
* Event bus
* Lifecycle

A worker is therefore a specialized Phestus host with an additional responsibility: exposing worker capabilities.

This makes workers fit naturally into the rest of the Phestus architecture rather than introducing a completely separate execution model.

## The Worker Architecture

The worker system separates several responsibilities:

```text
Worker Module
     │
     ▼
Worker Provider
     │
     ▼
Worker Transport
     │
     ▼
Phestus Worker
     │
     ▼
Worker Capability
```

The **Worker Module** exposes the worker API to Phestus.

The **Worker Provider** manages worker registration, discovery, health, and dispatch.

The **Worker Transport** handles communication between the provider and worker.

The **Phestus Worker** executes the requested capability.

This separation allows the communication mechanism to change without changing the worker architecture itself.
