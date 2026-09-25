---
title: Introduction
description: An introduction to jobs, workflows, queues, steps, and background execution within Phestus.
tags:
 - phestus
 - workflows
 - jobs
 -  queues
 - background-processing
order: 1
---

# Workflows & Jobs

Phestus provides a small execution system for running background work and composing that work into larger processes.

The system is built around three core concepts:

* **Jobs** represent individual units of background work.
* **Workflow Steps** represent individual operations within a workflow.
* **Workflows** compose multiple steps into an ordered process.

Both jobs and workflows can interact with the Phestus queue and event systems.

## How the System Fits Together

The relationship between the components is straightforward:

```text
Application
    │
    ├── Job
    │     │
    │     └── Queue
    │           │
    │           └── Job Handler
    │
    └── Workflow
          │
          ├── Step
          │     │
          │     └── Job / Module / Service
          │
          ├── Step
          │
          └── Step
```

A **job** represents something that needs to happen in the background.

A **workflow** represents a sequence of operations.

A **step** represents one operation within that workflow.

A **queue** provides the execution mechanism for background jobs so that work does not need to run directly inside the request that created it.

## Jobs

A job is a named unit of background work.

A job contains a name and a payload:

```ts
export interface Job<TPayload = unknown> {
    id?: string;
    name: string;
    payload: TPayload;
}
```

Jobs are registered with a handler and a queue:

```ts
job.register(
    "send-email",
    async (job, context) => {
        // Perform the work
    },
    {
        queue: "comms",
    },
);
```

The queue is part of the job's registration rather than the dispatched job itself. This allows multiple jobs to share the same queue.

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
    "process-payment",
    async (job, context) => {
        // Process payment
    },
    {
        queue: "payment",
    },
);
```

Jobs can then be dispatched without knowing which queue they use:

```ts
await job.dispatch({
    name: "send-email",
    payload: {
        email: "user@example.com",
    },
});
```

The Job Module resolves the registered job, determines its queue, and places it onto that queue.

## Queues

Jobs use the Queue Module underneath.

Queues represent groups of background work rather than individual jobs.

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
```

Internally, the Job Module may use queue names such as:

```text
phestus:jobs:comms
phestus:jobs:payment
```

A queue consumer listens to the queue and resolves the appropriate job handler using the job name.

This means multiple jobs can share the same queue and consumer.

The Queue Module itself does not need to know what a job means. It only provides the underlying queue capabilities.

This separation allows queue implementations to be provided independently from the job system.

## Workflows

A workflow is an ordered collection of **steps**.

A workflow definition describes the overall process:

```ts
const workflow = {
    slug: "order-processing",
    name: "Order Processing",
    version: "1.0.0",

    steps: [
        {
            id: "validate-order",
            type: "validate-order",
        },
        {
            id: "process-payment",
            type: "process-payment",
        },
        {
            id: "send-confirmation",
            type: "send-confirmation",
        },
    ],
};
```

The workflow itself does not contain the implementation of each operation.

Instead, every step references a registered step definition.

The Workflow Module resolves each step and executes them in order:

```text
Workflow
    │
    ├── Validate Order
    │
    ├── Process Payment
    │
    └── Send Confirmation
```

This makes steps the primary building blocks of a workflow.

## Workflow Steps

A workflow step defines one operation that can be performed during a workflow execution.

A step receives the current workflow context and its configuration:

```ts
const step = {
    type: "validate-order",
    name: "Validate Order",

    async execute(context, config) {
        // Validate the order

        return context;
    },
};
```

Steps can perform work directly or interact with other Phestus capabilities.

For example, a step can dispatch a job:

```ts
await context.job.dispatch({
    name: "send-email",
    payload: {
        email: "user@example.com",
    },
});
```

A step can also interact with modules, services, or other application capabilities.

This keeps workflows focused on **orchestration**, while the individual steps determine how each operation is performed.

## Step Context

Workflow steps receive an extended workflow context:

```ts
export interface WorkflowStepContext<TInput = unknown>
    extends WorkflowContext<TInput> {
    job: JobModule;
    logger: Logger;
}
```

The context contains information about the current execution:

```ts
export interface WorkflowContext<TInput = unknown> {
    input: TInput;
    event?: PhestusEvent;
    executionId: string;
    workflowId: string;
    metadata: Record<string, unknown>;
}
```

This allows steps to access the original workflow input, execution information, events, logging, jobs, and shared metadata.

A step can return a new context:

```ts
return {
    ...context,
    metadata: {
        ...context.metadata,
        orderId: "123",
    },
};
```

The returned context is passed to the next step.

This allows each step to build upon the work performed by previous steps.

## Jobs Within Steps

Jobs and workflow steps serve different purposes.

A **step** is part of the workflow's execution and can coordinate operations with the current workflow context.

A **job** represents background work that should be executed through a queue.

For example:

```text
Workflow
    │
    ├── Validate Order
    │
    ├── Process Payment
    │
    └── Send Confirmation
              │
              ▼
          send-email
              │
              ▼
            comms
```

The workflow does not need to know that `send-email` belongs to the `comms` queue.

That routing is defined when the job is registered.

## Jobs vs. Workflows

Jobs and workflows solve different problems.

### Use a Job When

You have one discrete piece of background work.

Examples include:

* Sending an email
* Generating a report
* Processing an uploaded file
* Updating an external service
* Performing an asynchronous database operation

### Use a Workflow When

You have multiple operations that form a process.

Examples include:

* Processing an order
* Onboarding a customer
* Publishing content
* Processing a payment
* Running a multi-stage data import

A workflow can also dispatch jobs when individual operations should happen asynchronously.

## Events and Workflows

The architecture also allows workflows to be connected to the Event Module.

A workflow can declare event triggers:

```ts
const workflow = {
    slug: "order-processing",
    name: "Order Processing",
    version: "1.0.0",

    triggers: [
        {
            event: "order.created",
        },
    ],

    steps: [
        // ...
    ],
};
```

This allows application events to become entry points into larger processes.

The resulting architecture can look like:

```text
Event
  │
  ▼
Workflow
  │
  ├── Step
  │
  ├── Step
  │
  └── Step
       │
       └── Job
            │
            ▼
          Queue
```

This keeps event production, workflow orchestration, and background execution separated from one another.

## Execution

When a workflow is executed, the engine generates an execution ID.

```ts
const result = await workflow.run(
    "order-processing",
    {
        orderId: "123",
    },
);
```

The result contains the workflow and execution identifiers along with its status:

```ts
{
    executionId: "...",
    workflowId: "order-processing",
    status: "completed",
    context: {}
}
```

If a step throws an error, execution is marked as failed:

```ts
{
    executionId: "...",
    workflowId: "order-processing",
    status: "failed",
    context: {},
    error: ...
}
```

Because steps execute in order, a failure prevents subsequent steps from being executed during that workflow run.

## The Design Philosophy

Jobs, steps, and workflows are intentionally small abstractions.

The Job Module does not decide how queues are implemented.

The Workflow Module does not decide what individual steps do.

Steps provide the connection between workflow orchestration and the capabilities provided by the rest of the Phestus system.

Modules and providers remain responsible for their own capabilities while jobs and workflows provide a way to coordinate those capabilities.

This allows an application to build increasingly complex background processes without coupling the entire system to one execution mechanism.

The basic model is:

```text
Modules provide capabilities.

Workflow Steps perform and coordinate operations.

Jobs perform individual units of background work.

Workflows coordinate multiple steps.

Queues execute background jobs.

Events can trigger workflows.
```

## Next

* Creating a Job
* Creating a Workflow
* Jobs & Workflows in Practice
