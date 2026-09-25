---
title: Creating a Workflow
description: Learn how to define, register, execute, and build workflow steps in Phestus.
tags:
 - phestus
 - workflows
 - jobs
 - events
order: 3
---

# Creating a Workflow

Workflows provide a way to compose multiple operations into a single process.

A workflow consists of:

* A workflow definition
* One or more steps
* Registered step implementations
* Optional event triggers

The Workflow Module executes steps sequentially and passes the workflow context from one step to the next.

## Defining a Workflow

A workflow is represented by a `WorkflowDefinition`.

```ts
const orderWorkflow = {
    slug: "order-processing",
    name: "Order Processing",
    version: "1.0.0",

    steps: [
        {
            id: "validate",
            type: "validate-order",
        },
        {
            id: "payment",
            type: "process-payment",
        },
        {
            id: "confirmation",
            type: "send-confirmation",
        },
    ],
};
```

Each step contains an ID and a type.

The `type` determines which registered step implementation will execute.

The workflow therefore describes **what operations should happen**, while the registered step definitions describe **how those operations happen**.

## Registering the Workflow

Register the workflow with the Workflow Module:

```ts
workflow.register(
    orderWorkflow,
);
```

The workflow can then be executed using its slug:

```ts
const result =
    await workflow.run(
        "order-processing",
        {
            orderId: "123",
        },
    );
```

The input becomes the initial workflow context.

## Creating a Workflow Step

Workflow steps are the primary building blocks of a workflow.

A workflow step is represented by a `WorkflowStepDefinition`:

```ts
workflow.registerStep({
    type: "validate-order",
    name: "Validate Order",

    async execute(
        context,
        config,
    ) {
        // Validate the order

        return context;
    },
});
```

The `type` must match the type referenced by a workflow step:

```ts
{
    id: "validate",
    type: "validate-order",
}
```

When the workflow engine reaches this step, it resolves the corresponding definition from the step registry and executes it.

## Step Execution

Steps execute sequentially in the order they appear in the workflow definition.

For example:

```text
Workflow
    │
    ▼
Validate Order
    │
    ▼
Process Payment
    │
    ▼
Send Confirmation
```

The output of one step becomes the context available to the next step.

This allows steps to build upon previous operations without requiring the workflow itself to manage that state.

## Step Configuration

Steps can contain configuration:

```ts
{
    id: "send-confirmation",
    type: "send-email",

    config: {
        template: "order-confirmation",
    },
}
```

The configuration is passed directly to the step:

```ts
workflow.registerStep({
    type: "send-email",
    name: "Send Email",

    async execute(
        context,
        config,
    ) {
        const template =
            config.template;

        // Use the template

        return context;
    },
});
```

This allows one step implementation to support multiple configurations.

For example, the same `send-email` step could be used by several workflows with different email templates.

## Workflow Context

Every workflow receives a context.

```ts
{
    input,
    event,
    executionId,
    workflowId,
    metadata,
}
```

The initial input is supplied when the workflow is run:

```ts
await workflow.run(
    "order-processing",
    {
        orderId: "123",
    },
);
```

The workflow engine creates an execution ID and constructs the initial context:

```ts
{
    input: {
        orderId: "123",
    },

    executionId: "...",

    workflowId:
        "order-processing",

    metadata: {},
}
```

The context is then passed through each step.

## Passing Data Between Steps

A step can return an updated context.

For example:

```ts
workflow.registerStep({
    type: "load-order",
    name: "Load Order",

    async execute(context) {
        const order = await loadOrder(
            context.input.orderId,
        );

        return {
            ...context,

            metadata: {
                ...context.metadata,
                order,
            },
        };
    },
});
```

The next step receives the returned context:

```ts
workflow.registerStep({
    type: "process-order",
    name: "Process Order",

    async execute(context) {
        const order =
            context.metadata.order;

        // Process order

        return context;
    },
});
```

This creates a simple data pipeline:

```text
Input
  │
  ▼
Step 1
  │
  ▼
Updated Context
  │
  ▼
Step 2
  │
  ▼
Updated Context
  │
  ▼
Step 3
```

The `metadata` object can be used to carry data between steps without changing the original workflow input.

## Using Jobs Inside a Workflow

Workflow steps receive the Job Module through their context:

```ts
interface WorkflowStepContext
    extends WorkflowContext {
    job: JobModule;
    logger: Logger;
}
```

This allows a step to dispatch background work.

For example:

```ts
workflow.registerStep({
    type: "send-confirmation",
    name: "Send Confirmation",

    async execute(context) {
        await context.job.dispatch({
            name: "send-email",

            payload: {
                orderId:
                    context.input.orderId,
            },
        });

        return context;
    },
});
```

The step does not need to specify the queue.

The queue is determined when the job is registered:

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
```

The resulting flow is:

```text
Workflow Step
    │
    ▼
Job Dispatch
    │
    ▼
send-email
    │
    ▼
comms Queue
    │
    ▼
Job Handler
```

This keeps workflow orchestration separate from queue routing and background execution.

## Event Triggers

Workflows can declare events that should trigger them:

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

This provides a natural connection between the Event Module and Workflow Module.

```text
order.created
      │
      ▼
  Workflow
      │
      ├── Validate
      ├── Process
      └── Complete
```

Event-triggered execution allows modules to publish events without needing direct knowledge of the workflows that consume them.

## Workflow Results

`workflow.run()` returns a `WorkflowExecutionResult`.

A successful execution returns:

```ts
{
    executionId,
    workflowId,
    status: "completed",
    context,
}
```

If a step throws an error, the workflow returns:

```ts
{
    executionId,
    workflowId,
    status: "failed",
    context,
    error,
}
```

The execution ID can be used by an application to correlate the result with other application data or logs.

## Designing Steps

Workflow steps should generally represent meaningful operations.

Good step boundaries might be:

```text
Validate Order
Load Customer
Reserve Inventory
Process Payment
Send Confirmation
```

Avoid making every small function a workflow step.

A step should represent an operation that makes sense as part of the larger process.

Steps should also remain focused on their responsibility. If an operation becomes sufficiently independent or needs background execution, it may be better represented as a job that the step dispatches.

## Reusing Steps

Because steps are registered by type, the same implementation can be used by multiple workflows.

For example:

```text
send-email
```

could be used by:

```text
Order Workflow
Password Reset Workflow
Account Registration Workflow
Invoice Workflow
```

Each workflow can provide different configuration.

This allows workflows to describe application processes while step implementations provide reusable behavior.

## Jobs, Steps, and Workflows Together

These components have distinct responsibilities:

```text
Workflow
    │
    ├── Step
    │     │
    │     └── Module / Service
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

The workflow defines the process.

The steps perform or coordinate individual operations.

Jobs handle discrete background work.

Queues provide the infrastructure used to execute those jobs.

## Summary

A workflow is built from:

```text
Workflow Definition
        │
        ▼
Workflow Steps
        │
        ▼
Workflow Context
        │
        └── Jobs → Queues
```

The Workflow Module handles workflow registration and execution while individual steps provide the actual operations.

Steps can interact directly with modules and services or dispatch jobs when work should be performed asynchronously.

This makes workflows useful for coordinating larger processes without coupling the process itself to a particular infrastructure implementation.

## Next

Continue to **Jobs & Workflows in Practice** to learn how to decide between jobs, steps, and workflows and how to combine them into larger application processes.
