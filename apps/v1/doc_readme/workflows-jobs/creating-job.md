---
title: Creating a Job
description: Learn how to create, register, queue, and dispatch background jobs with the Phestus Job Module.
tags:
 - phestus
 - jobs
 - queues
 - background-processing
order: 2
---

# Creating a Job

Jobs represent individual units of background work in Phestus.

A job consists of three primary parts:

1. A job name
2. A payload
3. A handler

When a job is registered, it is also assigned to a queue. The Job Module uses this registration to route dispatched jobs to the correct queue.

## Installing the Job Module

The Job Module depends on the Queue Module.

Your Phestus host therefore needs both modules:

```ts
import { QueueModule } from "@phestus/queue-module";
import { JobModule } from "@phestus/job-module";
```

The modules can then be created and provided to the Phestus runtime:

```ts
const queue = new QueueModule(
    queueProvider,
);

const job = new JobModule(
    queue,
);
```

The exact queue provider depends on the queue implementation being used by the application.

## Defining a Job Payload

Jobs are generic, so the payload can contain any application-specific data.

For example:

```ts
interface SendEmailPayload {
    recipient: string;
    subject: string;
    body: string;
}
```

The payload is supplied when the job is dispatched.

## Registering a Job

Jobs are registered with a name, handler, and queue.

```ts
job.register<SendEmailPayload>(
    "send-email",
    async (job, context) => {
        const {
            recipient,
            subject,
            body,
        } = job.payload;

        context.logger.info(
            `Sending email to ${recipient}`,
        );

        // Send the email
    },
    {
        queue: "comms",
    },
);
```

The job name identifies the job and its handler.

The queue identifies where that job should be executed.

The queue is registration metadata rather than part of the dispatched job itself. This means application code does not need to know how a job is routed when dispatching it.

## Sharing Queues

Multiple jobs can use the same queue.

For example:

```ts
job.register(
    "send-email",
    async (job, context) => {
        // Send email
    },
    {
        queue: "comms",
    },
);

job.register(
    "send-sms",
    async (job, context) => {
        // Send SMS
    },
    {
        queue: "comms",
    },
);

job.register(
    "send-push",
    async (job, context) => {
        // Send push notification
    },
    {
        queue: "comms",
    },
);
```

These jobs all belong to the `comms` queue:

```text
comms
├── send-email
├── send-sms
└── send-push
```

Another group of jobs can use a separate queue:

```text
payment
├── process-payment
├── payment-webhook
└── refund-payment
```

This allows queues to represent groups of related background work rather than creating a separate queue for every job.

## Dispatching a Job

Once the job has been registered, it can be dispatched:

```ts
await job.dispatch({
    name: "send-email",
    payload: {
        recipient: "user@example.com",
        subject: "Welcome",
        body: "Welcome to the application.",
    },
});
```

The caller does not specify the queue.

The Job Module looks up the registered job, determines its queue, and places the job onto that queue.

```text
dispatch()
    │
    ▼
Job Module
    │
    ├── Resolve Job
    │
    ├── Resolve Queue
    │
    ▼
Queue
    │
    ▼
Consumer
    │
    ▼
Job Handler
```

This keeps queue routing centralized within job registration.

## Queue Consumers

The Job Module creates consumers for the queues used by registered jobs.

For example, if the following jobs are registered:

```text
send-email       → comms
send-sms         → comms
process-payment  → payment
payment-webhook  → payment
```

The Job Module only needs consumers for:

```text
job:comms
job:payment
```

When a message is received, the Job Module uses the job name to locate the appropriate handler.

```text
comms queue
    │
    ├── send-email ──→ send-email handler
    ├── send-sms ────→ send-sms handler
    └── send-push ───→ send-push handler
```

This allows multiple jobs to share the same execution infrastructure.

## Job IDs

Jobs may optionally contain an ID:

```ts
const job = {
    id: "order-123",
    name: "process-order",
    payload: {
        orderId: "123",
    },
};
```

When a job is consumed from the queue, the Job Module also assigns the queue message ID to the job before passing it to the handler.

This allows handlers to identify the specific queue message they are processing.

## Using the Phestus Context

Every handler receives a `PhestusContext`:

```ts
job.register(
    "process-order",
    async (job, context) => {
        context.logger.info(
            `Processing order ${job.payload.orderId}`,
        );
    },
    {
        queue: "orders",
    },
);
```

The context gives the handler access to services and capabilities exposed by the Phestus runtime.

This keeps jobs independent from a particular application framework.

Instead of importing infrastructure directly into a handler, the handler can use the capabilities provided through the Phestus context.

## Job Registration

Jobs should generally be registered during application setup.

For example:

```ts
job.register(
    "process-order",
    async (job, context) => {
        // Process order
    },
    {
        queue: "orders",
    },
);

job.register(
    "send-email",
    async (job, context) => {
        // Send email
    },
    {
        queue: "comms",
    },
);
```

When the Job Module initializes, it starts consumers for the queues used by the registered jobs.

If a job is registered after initialization, its queue consumer is started automatically if one does not already exist.

## Queue Isolation

Queues allow related types of work to be grouped together.

For example:

```text
comms
├── send-email
├── send-sms
└── send-push

payment
├── process-payment
├── payment-webhook
└── refund-payment

media
├── resize-image
└── generate-thumbnail
```

This provides a useful level of isolation without creating a physical queue for every individual job.

The actual queue implementation is provided by the Queue Module's provider.

## Jobs and Workflow Steps

Jobs and workflow steps are complementary.

A workflow step represents an operation within a workflow, while a job represents work that should be executed through a queue.

For example:

```text
Order Workflow
    │
    ├── Validate Order
    │
    ├── Process Payment
    │
    ├── Update Inventory
    │
    └── Send Confirmation
             │
             ▼
        send-email
             │
             ▼
           comms
```

A workflow step can dispatch a job without needing to know which queue the job uses:

```ts
await context.job.dispatch({
    name: "send-email",
    payload: {
        recipient: "user@example.com",
    },
});
```

The job registration determines that `send-email` belongs to the `comms` queue.

This keeps workflow orchestration separate from background execution and queue routing.

## Handling Errors

Errors thrown by a job handler are allowed to propagate through the queue consumer:

```ts
job.register(
    "process-order",
    async (job, context) => {
        if (!job.payload.orderId) {
            throw new Error(
                "Order ID is required",
            );
        }

        // Process order
    },
    {
        queue: "orders",
    },
);
```

How failed jobs are retried, stored, or handled after failure depends on the underlying queue provider.

The Job Module is responsible for registering jobs, routing them to queues, and invoking handlers. The queue implementation is responsible for queue-level behavior.

## Keeping Jobs Focused

A job should generally represent one meaningful background operation.

For example:

```text
send-email
generate-report
process-payment
resize-image
sync-product
```

Instead of creating one large job:

```text
process-everything
```

larger processes should generally be represented using workflows.

For example:

```text
Order Workflow
    │
    ├── Validate Order
    ├── Process Payment
    ├── Update Inventory
    └── Send Confirmation
```

Individual workflow steps can then dispatch jobs when background execution is appropriate.

## Summary

Creating a job requires:

```text
Payload
   +
Job Name
   +
Handler
   +
Queue
   +
Dispatch
```

The Job Module handles job registration, queue routing, queue consumption, and handler execution.

The Queue Module provides the underlying queue infrastructure.

Jobs can share queues, allowing related work to be grouped together while keeping individual job handlers independent.

## Next

Continue to **Creating a Workflow** to learn how multiple steps can be composed into a single process.
