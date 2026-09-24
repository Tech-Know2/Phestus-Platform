---
title: Introduction
description: An introduction to the Phestus API architecture and the decisions behind the Server API and Client API modules.
tags:
 - phestus
 - api
 - api-client
 - providers
 - modules
 - typing
 - web stack
 - web framework
 - modular
order: 1
---

# Introduction

The Phestus API system provides a typed and modular way to expose functionality from a Phestus application and consume that functionality from a client.

Rather than making the API layer a large framework-specific system, Phestus separates the responsibilities into two modules:

* **API Module** — defines and registers server endpoints.
* **API Client Module** — provides a client for communicating with those endpoints.

This separation allows the server and client to remain independent while still sharing the same endpoint definitions and types.

The goal is to make APIs another composable capability of the Phestus platform rather than something that requires a large collection of framework-specific abstractions.

## Server and Client

The API architecture can be thought of as two sides of the same system:

```text
┌──────────────────────┐
│     Client App       │
│                      │
│   API Client Module  │
└──────────┬───────────┘
           │ HTTP
           ▼
┌──────────────────────┐
│     Server App       │
│                      │
│      API Module      │
└──────────┬───────────┘
           │
           ├── Auth Module
           │
           └── Middleware Module
```

The **API Module** is responsible for defining what the server exposes.

The **API Client Module** is responsible for making requests to those endpoints.

For example, a server can define:

```ts
const endpoint: ApiEndpoint<
    CreateUserBody,
    Record<string, string>,
    Record<string, string>,
    User
> = {
    method: "POST",
    path: "/users",

    async handler(request) {
        const user = await createUser(request.body);

        return {
            status: 201,
            data: user,
        };
    },
};
```

The client can then consume that endpoint:

```ts
const response = await client.request(endpoint, {
    body: {
        name: "Cooper",
        email: "cooper@example.com",
    },
});

console.log(response.data);
```

The same endpoint definition describes the HTTP method, path, request types, and response type on both sides.

## Why an API Module?

Phestus is designed around modules that provide focused capabilities.

An API should therefore be something that can be installed into a Phestus application rather than something that every application is forced to implement in the same way.

The API Module provides the basic capability to:

* define routes
* type request bodies
* type path parameters
* type query parameters
* type responses
* attach middleware
* expose endpoints through the Phestus runtime

The module does not attempt to dictate how the rest of the application should be structured.

A developer can therefore build an application such as:

```text
Phestus
│
├── Auth Module
├── Middleware Module
├── API Module
├── Event Module
├── Job Module
└── Workflow Module
```

and use those capabilities together.

## Why Separate Auth and Middleware?

Authentication, authorization, and middleware are related to APIs, but they are not the same capability.

The API Module needs to know that an endpoint can have middleware:

```ts
const endpoint: ApiEndpoint = {
    method: "GET",
    path: "/users",

    middleware: [
        "require-auth",
    ],

    async handler(request) {
        // ...
    },
};
```

It should not, however, need to implement the authentication system itself.

Authentication belongs to the **Auth Module**, while reusable request-processing and access-control behavior belongs to the **Middleware Module**.

This allows applications to compose those capabilities:

```text
API
 │
 ├── endpoint
 │
 ├── middleware
 │      │
 │      └── Auth
 │
 └── handler
```

This also means that the API Module can remain relatively small.

For information about authentication and authorization, see the Auth documentation.

For information about defining and applying middleware, see the Middleware documentation.

## Typed Endpoints

A major goal of the API system is to keep request and response structures explicit.

An endpoint can define four independent types:

```ts
ApiEndpoint<
    TBody,
    TParams,
    TQuery,
    TResponse
>
```

For example:

```ts
interface CreatePostBody {
    title: string;
    content: string;
}

interface Post {
    id: string;
    title: string;
    content: string;
}

const createPost: ApiEndpoint<
    CreatePostBody,
    Record<string, string>,
    Record<string, string>,
    Post
> = {
    method: "POST",
    path: "/posts",

    async handler(request) {
        const post = await createPostInDatabase(request.body);

        return {
            status: 201,
            data: post,
        };
    },
};
```

This makes the API contract explicit.

The body describes data being sent to the server.

Parameters describe values embedded in the URL.

Query values describe values supplied through the query string.

The response describes data returned from the endpoint.

## Parameters and Queries

Path parameters are represented directly in the endpoint path.

```ts
const endpoint: ApiEndpoint<
    unknown,
    { id: string },
    Record<string, string>,
    User
> = {
    method: "GET",
    path: "/users/:id",

    async handler(request) {
        const user = await findUser(request.params.id);

        return {
            status: 200,
            data: user,
        };
    },
};
```

A request can then provide:

```ts
{
    params: {
        id: "123",
    },
}
```

Query parameters are represented separately:

```ts
const endpoint: ApiEndpoint<
    unknown,
    Record<string, string>,
    { limit: string; search: string },
    User[]
> = {
    method: "GET",
    path: "/users",

    async handler(request) {
        // request.query.limit
        // request.query.search

        // ...
    },
};
```

The client can provide those values independently:

```ts
await client.request(endpoint, {
    query: {
        limit: "20",
        search: "cooper",
    },
});
```

Keeping these values separate makes the structure of an HTTP request explicit.

## Modules Are Registered With Phestus

The API Module is still a Phestus module.

It is created independently and then registered with the Phestus runtime alongside the other modules used by the application.

Conceptually:

```ts
const api = new ApiModule();

const auth = new AuthModule();
const middleware = new MiddlewareModule();

const phestus = new Phestus({
    modules: [
        auth,
        middleware,
        api,
    ],

    // service, logger, eventBus, etc.
});
```

Once the modules have been registered, they become part of the Phestus runtime and can be resolved through the configured Phestus module system.

This is an important part of the Phestus architecture.

Modules are not intended to be isolated utility classes that developers manually pass throughout their applications.

Instead, they are registered capabilities within the Phestus runtime.

That means an application can build its modules first:

```ts
const auth = new AuthModule();
const middleware = new MiddlewareModule();
const api = new ApiModule();
```

register them with Phestus, and then use the registered modules wherever those capabilities are required.

## API Definitions Are Reusable

An endpoint is an object rather than a framework-specific route declaration.

That makes it possible to use the same definition in multiple places.

For example:

```ts
export interface User {
    id: string;
    name: string;
}

export interface GetUserParams {
    id: string;
}

export const getUser: ApiEndpoint<
    unknown,
    GetUserParams,
    Record<string, string>,
    User
> = {
    method: "GET",
    path: "/users/:id",

    async handler(request) {
        const user = await findUser(request.params.id);

        return {
            status: 200,
            data: user,
        };
    },
};
```

The server registers the endpoint:

```ts
api.registerEndpoint(getUser);
```

The client can consume the same definition:

```ts
const response = await client.request(getUser, {
    params: {
        id: "123",
    },
});
```

This provides a shared contract without requiring the client and server to be implemented as one application.

## The API as a Contract

The most important concept in the Phestus API system is that an endpoint represents a contract.

```text
Endpoint
│
├── Method
├── Path
├── Parameters
├── Query
├── Body
├── Middleware
└── Response
```

The server implements that contract.

The client consumes that contract.

This keeps the API layer understandable while still allowing applications to build significantly more complex systems around it.

The following articles cover each side of the system in detail:

* **Server API** — creating and registering server endpoints.
* **Client API** — consuming those endpoints from a client application.