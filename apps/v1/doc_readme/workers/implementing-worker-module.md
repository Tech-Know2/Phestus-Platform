---

title: Implementing the Worker Module
description: How to install and register the Worker Module in a Phestus host.
tags:
 - phestus
 - workers
 - modules
 - core
order: 2
---

# Implementing the Worker Module

The Worker Module provides the worker management API to the main Phestus host.

Like other Phestus modules, it does not implement the underlying infrastructure itself. Instead, it receives a `WorkerProvider` and exposes that provider through the module API.

## Creating the Worker Module

The module is implemented as follows:

```ts
export class WorkerModule implements PhestusModule {
    manifest = {
        slug: "worker",
        name: "Worker Module",
        version: "0.1.0",
    };

    constructor(
        private readonly provider: WorkerProvider,
    ) {}

    registerWorker(worker: Worker) {
        return this.provider.registerWorker(worker);
    }

    getWorker(id: string) {
        return this.provider.getWorker(id);
    }

    listWorkers() {
        return this.provider.listWorkers();
    }

    removeWorker(id: string) {
        return this.provider.removeWorker(id);
    }

    updateWorker(
        id: string,
        worker: Partial<Worker>,
    ) {
        return this.provider.updateWorker(id, worker);
    }

    dispatch<T>(request: WorkerRequest<T>) {
        return this.provider.dispatch(request);
    }

    heartbeat(id: string) {
        return this.provider.heartbeat(id);
    }

    getHealth(id: string) {
        return this.provider.getHealth(id);
    }
}
```

The module is intentionally thin.

It does not need to know how workers are stored, how workers communicate, or how worker discovery works. Those responsibilities belong to the configured provider.

## Adding the Module to Phestus

The core Phestus host accepts modules through `PhestusConfig`:

```ts
export interface PhestusConfig {
    plugins?: PhestusPlugin[];
    modules?: PhestusModule[];
    service: PhestusService;
    logger: Logger;
    eventBus: EventBus;
}
```

The Worker Module can therefore be added alongside the rest of the application's modules.

```ts
const workerModule = new WorkerModule(
    workerProvider,
);

const phestus = new Phestus({
    service,
    logger,
    eventBus,

    modules: [
        workerModule,
    ],
});
```

The module is now part of the Phestus host and participates in the same module lifecycle and registration system as the rest of the platform.

## Why Does the Module Use a Provider?

The Worker Module intentionally does not contain infrastructure logic.

For example, this method:

```ts
listWorkers() {
    return this.provider.listWorkers();
}
```

delegates the operation to the configured provider.

This means the application can change the worker implementation without changing the module API.

For example:

```text
Worker Module
      │
      ├── Redis Provider
      │
      ├── Database Provider
      │
      └── Custom Provider
```

The rest of the application continues to interact with the same Worker Module.

## Dispatching Work

Once the Worker Module has been registered, work can be dispatched using a `WorkerRequest`:

```ts
await workerModule.dispatch({
    capability: "email.send",
    payload: {
        to: "user@example.com",
        subject: "Welcome",
        body: "Welcome to Phestus!",
    },
});
```

The module passes the request to the provider:

```text
Application
     │
     ▼
Worker Module
     │
     ▼
Worker Provider
     │
     ▼
Worker Transport
     │
     ▼
Worker
```

The module therefore acts as the Phestus-facing API while the provider and transport handle the implementation.

## Managing Workers

The module also exposes worker management operations.

```ts
await workerModule.registerWorker(worker);

const worker = await workerModule.getWorker(
    "worker-01",
);

const workers = await workerModule.listWorkers();

await workerModule.updateWorker(
    "worker-01",
    {
        status: "draining",
    },
);

await workerModule.heartbeat(
    "worker-01",
);

const health = await workerModule.getHealth(
    "worker-01",
);
```

The important architectural boundary is that the application does not need to know where worker information is stored or how communication occurs.

That responsibility belongs to the provider.

## The Module's Responsibility

The Worker Module is therefore responsible for exposing the worker capability to the Phestus runtime.

It provides the application with a consistent API for:

* Registering workers
* Finding workers
* Listing workers
* Updating workers
* Removing workers
* Dispatching requests
* Sending heartbeats
* Reading worker health

The provider determines how those operations actually work.
