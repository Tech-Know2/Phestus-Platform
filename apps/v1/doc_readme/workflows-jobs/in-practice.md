---
title: Jobs & Workflows in Practice
description: Learn how to combine jobs, workflow steps, workflows, events, and queues to build reliable background processes in Phestus.
tags:
 - phestus
 - workflows
 - jobs
 - events
 - queues
 - architecture
order: 4
---

# Jobs & Workflows in Practice

Jobs and workflows are most useful when they are used together.

A job is a unit of background work.

A workflow is a process composed of steps.

A step represents an individual operation within that process.

The distinction is important because it helps keep application architecture understandable as processes become more complex.

## Choosing Between a Job and a Workflow

A useful rule is:

> If you are describing one background operation, use a job. If you are describing a process, use a workflow.

For example:

```text
Generate Invoice
```

can be represented as a job.

But:

```text
Create Order
    ↓
Process Payment
    ↓
Generate Invoice
    ↓
Send Confirmation
```

is better represented as a workflow.

The workflow describes the process through its steps, while jobs can perform individual operations asynchronously within that process.

## A Typical Architecture

A larger application might look like this:

```text
Application
    │
    ▼
Event
    │
    ▼
Workflow
    │
    ├── Step
    │
    ├── Step
    │     │
    │     └── Job
    │           │
    │           └── Queue
    │
    └── Step
```

Each layer has a different responsibility.

### Events

Events communicate that something happened.

```text
order.created
payment.completed
customer.registered
```

### Workflows

Workflows coordinate processes.

```text
Order Processing
Customer Onboarding
Content Publishing
```

### Steps

Steps represent individual operations within a workflow.

```text
Validate Order
Reserve Inventory
Process Payment
Send Confirmation
```

Steps can perform work directly through modules and services or dispatch jobs when background execution is appropriate.

### Jobs

Jobs perform discrete background operations.

```text
send-email
generate-invoice
sync-product
```

### Queues

Queues provide the execution infrastructure for background jobs.

Jobs are assigned to queues when they are registered. Multiple jobs can share the same queue:

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

This allows queues to represent workload groups rather than individual jobs.

## Example: Order Processing

Consider an ecommerce application.

An order is created:

```text
order.created
```

The event can trigger an order workflow through the workflow's event trigger:

```ts
workflow.register({
    slug: "order-processing",
    name: "Order Processing",
    version: "1.0.0",

    triggers: [
        {
            event: "order.created",
        },
    ],

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
});
```

The `triggers` property tells the Workflow Module which events should start the workflow.

The Workflow Module subscribes to those events through the Event Module:

```text
order.created
      │
      ▼
   EventBus
      │
      ▼
Workflow Module
      │
      ▼
Order Processing
```

You do not need to manually create a separate event listener for every workflow. The Workflow Module manages the subscriptions based on the workflow definitions.

When the event is emitted:

```ts
await context.eventBus.emit({
    id: crypto.randomUUID(),
    type: "order.created",
    source: "orders",
    data: {
        orderId: "123",
    },
    timestamp: new Date(),
});
```

the Workflow Module receives the event and starts the matching workflow.

The workflow could contain:

```text
Validate Order
      │
      ▼
Reserve Inventory
      │
      ▼
Process Payment
      │
      ▼
Send Confirmation
```

The confirmation step might dispatch a job:

```ts
await context.job.dispatch({
    name: "send-order-confirmation",
    payload: {
        orderId,
    },
});
```

The job is registered with its queue separately:

```ts
job.register(
    "send-order-confirmation",
    async (job, context) => {
        // Send confirmation
    },
    {
        queue: "comms",
    },
);
```

The resulting architecture is:

```text
order.created
      │
      ▼
   EventBus
      │
      ▼
Order Workflow
      │
      ├── Validate
      │
      ├── Reserve Inventory
      │
      ├── Process Payment
      │
      └── Send Confirmation
              │
              ▼
             Job
              │
              ▼
          comms Queue
              │
              ▼
          Job Handler
```

The workflow does not need to know how the queue is implemented.

The workflow step does not need to know which queue the job uses.

The job does not need to know which workflow dispatched it.

The queue does not need to know anything about orders.

Each layer has a clear responsibility.

## Event-Triggered Workflows

Workflows can be started in two ways.

A workflow can be run directly:

```ts
await workflow.run(
    "order-processing",
    {
        orderId: "123",
    },
);
```

Or it can be triggered by an event:

```ts
workflow.register({
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
});
```

With an event trigger, the flow becomes:

```text
Event Emitted
      │
      ▼
   EventBus
      │
      ▼
Workflow Trigger
      │
      ▼
Workflow Engine
      │
      ▼
Workflow Steps
```

This allows workflows to respond to application events without requiring the code that emits the event to know which workflows are listening.

## Keep Jobs Focused

A job should generally have one purpose.

For example:

```text
send-email
```

is easier to understand than:

```text
process-order-and-send-email-and-update-inventory
```

If several operations need to happen together, they can instead be represented as a workflow with individual steps.

This makes individual jobs easier to reuse.

## Keep Workflows Descriptive

A workflow should describe a process rather than become a container for every piece of application logic.

For example:

```text
Order Processing
    ├── Validate Order
    ├── Process Payment
    ├── Reserve Inventory
    └── Send Confirmation
```

The step names describe what the process does.

The implementations of those steps contain the actual application logic.

This keeps the workflow definition readable.

## Design Meaningful Steps

Steps should represent meaningful operations within the process.

Good step boundaries might be:

```text
Validate Order
Load Customer
Reserve Inventory
Process Payment
Send Confirmation
```

A step does not need to represent every individual function or operation.

For example, a `Validate Order` step may internally perform several validation checks while still representing one meaningful operation within the workflow.

Steps can also interact with other Phestus capabilities:

```text
Step
 ├── Module
 ├── Service
 └── Job
```

This makes steps the orchestration layer between a workflow and the capabilities used to perform it.

## Use Step Configuration for Variation

Steps can be configured instead of creating separate implementations for every variation.

For example:

```ts
{
    id: "confirmation",
    type: "send-email",
    config: {
        template: "order-confirmation",
    },
}
```

Another workflow can use the same step:

```ts
{
    id: "welcome",
    type: "send-email",
    config: {
        template: "welcome",
    },
}
```

The step implementation remains the same.

Only the configuration changes.

This allows step implementations to remain reusable across workflows.

## Use the Workflow Context for Execution Data

The workflow context provides a place to carry execution-specific information.

For example:

```ts
return {
    ...context,

    metadata: {
        ...context.metadata,
        orderId,
        customerId,
    },
};
```

Later steps can access this information.

This is particularly useful when a previous step has loaded or transformed data that subsequent steps need.

The context should contain data relevant to the current execution rather than becoming a general-purpose application store.

## Events, Jobs, Steps, and Workflows Are Complementary

These systems are not competing alternatives.

They solve different problems.

```text
Event
"What happened?"

Workflow
"What process should happen?"

Step
"What operation should happen within that process?"

Job
"What background operation needs to happen?"

Queue
"Where should that background operation execute?"
```

For example:

```text
customer.registered
        │
        ▼
Customer Onboarding Workflow
        │
        ├── Create Profile
        ├── Initialize Preferences
        └── Send Welcome Email
                    │
                    ▼
                send-email
                    │
                    ▼
                  comms
```

This separation allows the application to grow without placing every responsibility into a single module.

## Building Reusable Infrastructure

The Job and Workflow Modules are intentionally infrastructure-focused.

Application-specific behavior belongs in registered handlers and steps.

For example, the Job Module does not need to know what an email is.

It only knows that:

```ts
job.register(
    "send-email",
    handler,
    {
        queue: "comms",
    },
);
```

Similarly, the Workflow Module does not need to know what an order is.

It only knows how to execute registered steps:

```ts
{
    type: "process-order",
}
```

This allows application-specific capabilities to be implemented by other Phestus modules, plugins, or providers.

## A Useful Mental Model

When building a new feature, consider the layers separately.

### 1. Does something need to be communicated?

Use an event.

```text
product.updated
```

### 2. Does a process need to coordinate several operations?

Use a workflow.

```text
Product Publishing
```

### 3. What individual operations make up the process?

Use workflow steps.

```text
Validate Product
Update Catalog
Generate Search Index
```

### 4. Does one operation need to run asynchronously?

Use a job.

```text
generate-search-index
```

### 5. Where should the background operation execute?

Assign the job to a queue during registration.

```text
search
├── generate-search-index
├── update-search-index
└── remove-search-index
```

This gives you a simple architectural model:

```text
Something happened?
        │
        ▼
      Event
        │
        ▼
Multiple operations?
   │            │
  Yes           No
   │             │
   ▼             ▼
Workflow        Job
   │             │
   ▼             │
 Steps           │
   │             │
   └──────┬──────┘
          ▼
        Queue
```

## Designing for Growth

The goal of the system is not to force every application to use workflows and jobs.

Small applications may only need a few jobs.

Larger applications may benefit from workflows that coordinate many modules and background operations.

The architecture allows the system to grow gradually.

You can start with:

```text
Job → Queue
```

and later introduce:

```text
Event → Workflow → Steps → Job → Queue
```

without changing the underlying job abstraction.

This is one of the primary benefits of keeping events, workflows, jobs, steps, and queues as separate modules.

## Summary

Jobs and workflows provide different levels of execution.

Jobs represent individual background operations.

Workflows represent larger processes composed of multiple steps.

Steps provide the operations that make up those processes.

Events can trigger workflows through workflow triggers, while queues provide the infrastructure required to execute background jobs.

The resulting model is:

```text
Events
  ↓
Workflows
  ↓
Steps
  ↓
Jobs
  ↓
Queues
```

Each component has a specific responsibility, and each can be extended independently as the application grows.

## Related

* Workflows & Jobs
* Creating a Job
* Creating a Workflow
* Events
* Queues
* Modules
* Providers
