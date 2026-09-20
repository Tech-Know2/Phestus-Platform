---
title: Event Bus Creation
order: 4
description: A guide on event management and queues inside of Phestus
tags:
  - phestus
  - event bus
  - queue
  - event
  - web stack
  - web framework
  - modular
---

## Creating an Event Bus

The Phestus Event Bus provides a common interface for publishing and subscribing to events.

The `EventBus` interface is included in `@phestus/sdk` and can be implemented using any event system you prefer.

## Event Structure

Every Phestus event follows the `PhestusEvent` interface:

```ts
import type { PhestusEvent } from '@phestus/sdk'

const event: PhestusEvent = {
    id: 'example-event-id',
    type: 'example.created',
    source: 'my-application',
    data: {
        message: 'Hello Phestus',
    },
    timestamp: new Date(),
}
```

The event contains:

* `id` - A unique identifier for the event.
* `type` - The type of event being emitted.
* `source` - The application or system that produced the event.
* `data` - The data associated with the event.
* `timestamp` - When the event was created.

## Event Bus Interface

An Event Bus must implement two operations:

```ts
import type { EventBus } from '@phestus/sdk'

export const eventBus: EventBus = {
    async emit(event) {
        // Publish the event
    },

    async subscribe(type, handler) {
        // Subscribe to the event type

        return async () => {
            // Unsubscribe
        }
    },
}
```

### Emitting Events

Events can be published using `emit`:

```ts
await eventBus.emit({
    id: crypto.randomUUID(),
    type: 'example.created',
    source: 'my-application',
    data: {
        message: 'Hello Phestus',
    },
    timestamp: new Date(),
})
```

### Subscribing to Events

Handlers can subscribe to a specific event type:

```ts
await eventBus.subscribe('example.created', {
    event: 'example.created',

    async handle(event) {
        console.log('Event received:', event)
    },
})
```

`subscribe` returns an unsubscribe function that can be called when the subscription is no longer needed.

## Using the Event Module

Phestus includes an `EventModule` that implements the `EventBus` interface.

The Event Module is built on top of the `QueueModule`. This means the Queue Module provides the underlying transport while the Event Module provides the higher-level event abstraction.

```text
Queue Provider
     ↓
Queue Module
     ↓
Event Module
     ↓
Event Bus
```

The Event Module can therefore be used directly as the `eventBus` in your Phestus configuration.

First, create the Queue Module using a queue provider:

```ts
import { QueueModule } from '@phestus/queue-module'

const queue = new QueueModule(queueProvider)
```

Then create the Event Module using the Queue Module:

```ts
import { EventModule } from '@phestus/event-module'

const event = new EventModule(queue)
```

Because `EventModule` implements `EventBus`, it can be provided directly to the Phestus configuration:

```ts
import { Phestus } from '@phestus/core'

const phestus = new Phestus({
    service,
    logger,
    eventBus: event,

    modules: [
        queue,
        event,
    ],
})
```

The Event Module handles translating the Event Bus operations into queue operations internally. Your application can therefore use the `EventBus` interface without needing to interact directly with the underlying queue provider.

## Custom Event Bus Implementations

The provided Event Module is not required. You can implement `EventBus` yourself if your application uses another event system.

For example, an implementation could use Redis, an in-memory event system, a message broker, or another event infrastructure.

As long as the implementation satisfies the `EventBus` interface, it can be supplied to `PhestusConfig`:

```ts
const phestus = new Phestus({
    service,
    logger,
    eventBus: customEventBus,
})
```

This keeps the rest of Phestus independent from the underlying event infrastructure.
