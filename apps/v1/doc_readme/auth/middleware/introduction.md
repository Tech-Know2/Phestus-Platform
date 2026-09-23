---
title: Introduction to Middleware
description: Learn how middleware works in Phestus and how middleware operations can be registered and applied to API endpoints.
tags:
 - phestus
 - middleware
 - auth
 - typing
 - web stack
 - web framework
 - modular
order: 1
---
# Introduction to Middleware

Middleware provides a way to execute custom logic before and after an API endpoint handler runs.

In Phestus, middleware is provided by the **Middleware Module** and is designed to remain independent from the API and authentication modules. This allows applications to define their own request-processing rules without requiring the API module to contain application-specific logic.

A middleware operation receives a request and a `next` function. It can inspect or modify the request, stop execution by returning a response, or call `next()` to continue to the next middleware or the endpoint handler.

## The Middleware Module

The Middleware Module provides three primary capabilities:
* Register middleware operations.
* Retrieve registered middleware.
* Execute middleware for a request.

```ts
export interface MiddlewareRegistry {
    use(middleware: Middleware): void;

    getMiddleware(): Middleware[];

    execute(
        request: MiddlewareRequest,
        handler: MiddlewareNext,
        middleware?: string[],
    ): Promise<MiddlewareResponse>;
}
```

Middleware is registered using `use()`:

```ts
middleware.use(myMiddleware);
```

Registered middleware is stored by the module and can later be selected when an API endpoint is executed.

## Middleware Operations

A middleware operation implements the `Middleware` interface:

```ts
export interface Middleware {
    name: string;

    handle(
        request: MiddlewareRequest,
        next: MiddlewareNext,
    ): Promise<MiddlewareResponse>;
}
```

Every middleware operation has two parts:

* `name` — the unique identifier used to reference the middleware.
* `handle()` — the function that performs the middleware logic.

The request contains the information available to middleware:

```ts
export interface MiddlewareRequest {
    method: string;
    path: string;
    body: unknown;
    params: Record<string, string>;
    query: Record<string, string>;
    headers: Record<string, string>;
    context: Record<string, unknown>;
}
```

The response returned by middleware follows a common structure:

```ts
export interface MiddlewareResponse {
    status: number;
    data?: unknown;
    headers?: Record<string, string>;
}
```

This keeps middleware independent of a specific HTTP framework.

## Continuing the Request

The `next` function controls whether execution continues.

```ts
const middleware: Middleware = {
    name: "example",

    async handle(request, next) {
        console.log("Before handler");

        const response = await next();

        console.log("After handler");

        return response;
    },
};
```

Calling `next()` passes execution to the next selected middleware. Once there are no more middleware operations, execution continues to the endpoint's handler.

Conceptually, a request flows through middleware like this:

```text
Request
   │
   ▼
Middleware A
   │
   ▼
Middleware B
   │
   ▼
Middleware C
   │
   ▼
Endpoint Handler
   │
   ▼
Response
```

Because middleware receives the response from `next()`, it can also perform logic after the endpoint has completed.

## Stopping Execution

Middleware does not have to call `next()`.

For example, an authorization middleware can return a response immediately:

```ts
const authorization: Middleware = {
    name: "authorization",

    async handle(request, next) {
        const authorized = true;

        if (!authorized) {
            return {
                status: 403,
                data: {
                    message: "Forbidden",
                },
            };
        }

        return next();
    },
};
```

When middleware returns a response without calling `next()`, the remaining middleware and endpoint handler are not executed.

This makes middleware useful for concerns such as:

* Authentication checks
* Authorization rules
* Request validation
* Rate limiting
* Logging
* Request transformation
* Response transformation
* Custom access rules
* Application-specific request handling

## Selecting Middleware

API endpoints can specify which middleware operations should execute:

```ts
const endpoint: ApiEndpoint = {
    method: "GET",
    path: "/users",

    middleware: [
        "authentication",
        "authorization",
    ],

    async handler(request) {
        return {
            status: 200,
            data: [],
        };
    },
};
```

The API module can then execute the endpoint's selected middleware through the Middleware Module.

If an endpoint does not specify middleware, the Middleware Module can execute all registered middleware.

This provides two useful patterns:

```text
All registered middleware
        │
        ▼
    API endpoint
```

or:

```text
Registered middleware
        │
        ├── authentication
        ├── authorization
        ├── logging
        └── validation

                │
                ▼

        Endpoint selects
        authentication
        + authorization
```

## Middleware and Authentication

Middleware is intentionally separate from authentication.

The Auth Module is responsible for authentication and authorization capabilities, while middleware is responsible for determining **when and how those capabilities are applied to a request**.

For example, an authentication middleware can use the Auth Module to authenticate the incoming request:

```text
API Request
     │
     ▼
Authentication Middleware
     │
     ▼
Auth Module
     │
     ▼
Auth Provider
     │
     ▼
Authenticated Actor
     │
     ▼
Next Middleware / Handler
```

This separation allows different middleware operations to use the same authentication system without placing middleware-specific behavior inside the Auth Module.

## Middleware and the API Module

The API Module depends on the Middleware Module:

```ts
dependencies: [
    {
        type: "module",
        slug: "auth",
        version: "0.1.0",
        optional: false,
    },
    {
        type: "module",
        slug: "middleware",
        version: "0.1.0",
        optional: false,
    },
],
```

The API module defines routes and handlers, while the Middleware Module provides request-processing capabilities.

An API endpoint can therefore declare its middleware independently:

```ts
const endpoint: ApiEndpoint = {
    method: "POST",
    path: "/posts",

    middleware: [
        "authentication",
        "authorization",
    ],

    async handler(request) {
        // Endpoint logic
    },
};
```

This keeps the responsibilities of the modules separate:

| Module     | Responsibility                   |
| ---------- | -------------------------------- |
| Auth       | Authentication and authorization |
| Middleware | Request-processing operations    |
| API        | Routes and endpoint handlers     |

## Middleware as an Extension Point

The Middleware Module is intentionally small. It does not attempt to define every possible middleware behavior.

Instead, it provides a common execution model that developers can extend with their own operations.

A Phestus application could therefore define middleware for its own requirements without modifying the Middleware Module itself.

For example:

```text
Phestus
│
├── Auth Module
│
├── Middleware Module
│   ├── Authentication
│   ├── Authorization
│   ├── Logging
│   └── Validation
│
└── API Module
    ├── GET /users
    ├── POST /users
    └── DELETE /users
```

## This is the primary purpose of middleware in Phestus: **provide a small, reusable execution layer that applications can use to add custom request-processing behavior to their APIs.**