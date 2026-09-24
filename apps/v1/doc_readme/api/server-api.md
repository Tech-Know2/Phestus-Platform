---
title: Server API
description: Learn how to create, type, and register HTTP endpoints with the Phestus API Module.
tags:
 - phestus
 - api
 - server
 - endpoints
 - auth
 - middleware
 - modules
 - typing
 - web stack
 - web framework
 - modular
order: 2
---

# Server API

The Phestus API Module provides the server-side API layer for a Phestus application.

It allows you to define HTTP endpoints as typed objects and register them with the API Module.

An endpoint contains:

* HTTP method
* URL path
* optional middleware
* request types
* handler
* response type

The API Module itself does not dictate how your application stores data or implements business logic. The handler is responsible for connecting the endpoint to the rest of your application.

## Creating the API Module

The API Module is a normal Phestus module.

```ts
import { ApiModule } from "@phestus/api-module";

const api = new ApiModule();
```

The API Module declares dependencies on the Auth and Middleware modules:

```text
API Module
│
├── Auth Module
└── Middleware Module
```

This allows API endpoints to integrate with authentication and middleware without placing those responsibilities inside the API module itself.

Create the modules independently and register them with Phestus:

```ts
const auth = new AuthModule();
const middleware = new MiddlewareModule();
const api = new ApiModule();

const phestus = new Phestus({
    modules: [
        auth,
        middleware,
        api,
    ],

    // service, logger, eventBus, etc.
});
```

After registration, the modules become part of the Phestus runtime and can be resolved through the configured module system.

This follows the general Phestus module architecture: modules are created, registered with Phestus, and then consumed as registered capabilities.

## Creating an Endpoint

An endpoint is represented by the `ApiEndpoint` type.

```ts
import type {
    ApiEndpoint,
} from "@phestus/api-module";
```

The simplest endpoint looks like this:

```ts
const healthEndpoint: ApiEndpoint = {
    method: "GET",
    path: "/health",

    async handler() {
        return {
            status: 200,
            data: {
                status: "ok",
            },
        };
    },
};
```

The endpoint can then be registered:

```ts
api.registerEndpoint(healthEndpoint);
```

The API Module stores the endpoint using its HTTP method and path:

```text
GET:/health
```

If another endpoint is registered using the same method and path, the API Module throws an error rather than silently replacing the existing endpoint.

## HTTP Methods

The API Module supports the standard HTTP methods:

```ts
type ApiMethod =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";
```

For example:

```ts
const getUsers: ApiEndpoint = {
    method: "GET",
    path: "/users",

    async handler() {
        // ...
    },
};
```

```ts
const createUser: ApiEndpoint = {
    method: "POST",
    path: "/users",

    async handler(request) {
        // ...
    },
};
```

```ts
const updateUser: ApiEndpoint = {
    method: "PATCH",
    path: "/users/:id",

    async handler(request) {
        // ...
    },
};
```

The same path can therefore have multiple endpoints as long as their methods differ.

```text
GET    /users
POST   /users
PATCH  /users/:id
DELETE /users/:id
```

## Request Types

An API request contains four pieces of information:

```ts
export interface ApiRequest<
    TBody = unknown,
    TParams = Record<string, string>,
    TQuery = Record<string, string>,
> {
    body: TBody;
    params: TParams;
    query: TQuery;
    headers: Record<string, string>;
}
```

This gives handlers access to:

* `request.body`
* `request.params`
* `request.query`
* `request.headers`

Each can be typed independently.

## Request Body

Consider a user creation endpoint.

First define the body:

```ts
interface CreateUserBody {
    name: string;
    email: string;
}
```

Then use it as the endpoint body type:

```ts
const createUser: ApiEndpoint<
    CreateUserBody,
    Record<string, string>,
    Record<string, string>,
    User
> = {
    method: "POST",
    path: "/users",

    async handler(request) {
        const user = await userService.create({
            name: request.body.name,
            email: request.body.email,
        });

        return {
            status: 201,
            data: user,
        };
    },
};
```

The handler now knows exactly what the request body contains.

## Path Parameters

Path parameters are defined using `:parameter` syntax.

For example:

```ts
const getUser: ApiEndpoint<
    unknown,
    { id: string },
    Record<string, string>,
    User
> = {
    method: "GET",
    path: "/users/:id",

    async handler(request) {
        const user = await userService.findById(
            request.params.id,
        );

        return {
            status: 200,
            data: user,
        };
    },
};
```

The path:

```text
/users/:id
```

defines an `id` parameter.

The request type:

```ts
{
    id: string;
}
```

describes that parameter to the handler.

A client request would eventually provide:

```ts
{
    params: {
        id: "123",
    },
}
```

## Query Parameters

Query parameters are separate from path parameters.

For example:

```ts
interface UserQuery {
    search: string;
    limit: string;
}
```

The endpoint can use that type:

```ts
const listUsers: ApiEndpoint<
    unknown,
    Record<string, string>,
    UserQuery,
    User[]
> = {
    method: "GET",
    path: "/users",

    async handler(request) {
        const users = await userService.findMany({
            search: request.query.search,
            limit: Number(request.query.limit),
        });

        return {
            status: 200,
            data: users,
        };
    },
};
```

A request might contain:

```text
GET /users?search=cooper&limit=20
```

The handler receives:

```ts
request.query.search
request.query.limit
```

as strings.

The API module does not automatically convert query values into numbers, booleans, or other types. If an endpoint requires a conversion or validation step, that logic can be handled by the endpoint or middleware.

## Headers

Headers are available through:

```ts
request.headers
```

For example:

```ts
const endpoint: ApiEndpoint = {
    method: "GET",
    path: "/profile",

    async handler(request) {
        const authorization =
            request.headers.authorization;

        // ...

        return {
            status: 200,
            data: {},
        };
    },
};
```

Headers are useful for values such as authorization credentials, content negotiation, request identifiers, or other HTTP metadata.

Authentication itself should generally be handled by the Auth Module rather than being implemented independently in every endpoint.

## Responses

Every endpoint returns an `ApiResponse`.

```ts
export interface ApiResponse<T = unknown> {
    status: number;
    data: T;
}
```

For example:

```ts
const endpoint: ApiEndpoint = {
    method: "GET",
    path: "/health",

    async handler() {
        return {
            status: 200,
            data: {
                status: "ok",
            },
        };
    },
};
```

A typed response can be provided as the fourth generic parameter:

```ts
interface User {
    id: string;
    name: string;
}

const endpoint: ApiEndpoint<
    unknown,
    { id: string },
    Record<string, string>,
    User
> = {
    method: "GET",
    path: "/users/:id",

    async handler(request) {
        const user = await userService.findById(
            request.params.id,
        );

        return {
            status: 200,
            data: user,
        };
    },
};
```

The client can then receive `User` as its response type when it uses the same endpoint definition.

## Middleware

Endpoints can specify middleware using the `middleware` property:

```ts
const getAccount: ApiEndpoint = {
    method: "GET",
    path: "/account",

    middleware: [
        "require-auth",
    ],

    async handler(request) {
        // ...
    },
};
```

Middleware names are represented as strings so that the API module does not need to own the implementation of every middleware behavior.

This allows the Middleware Module to provide reusable request-processing and access-control capabilities.

For example, an application might define middleware for:

```text
require-auth
require-admin
rate-limit
validate-request
logging
```

The exact middleware available to an application depends on the middleware registered with Phestus.

For a complete explanation of middleware creation and registration, see the Middleware documentation.

## Authentication

Authentication follows the same separation of concerns.

The API Module defines the route:

```ts
const getProfile: ApiEndpoint = {
    method: "GET",
    path: "/profile",

    middleware: [
        "require-auth",
    ],

    async handler(request) {
        // authenticated request

        return {
            status: 200,
            data: {},
        };
    },
};
```

The API Module does not need to implement password handling, sessions, tokens, credentials, or identity storage.

Those responsibilities belong to the Auth Module.

This means the API can remain focused on routing while authentication can evolve independently.

For example:

```text
API Endpoint
     │
     ▼
Middleware
     │
     ▼
Authentication
     │
     ▼
Handler
```

See the Auth documentation for the authentication and authorization model.

## Registering Multiple Routes

An application can create as many endpoints as it needs and register them with the API Module.

```ts
const getUsers: ApiEndpoint = {
    method: "GET",
    path: "/users",

    async handler() {
        return {
            status: 200,
            data: await userService.findMany(),
        };
    },
};

const getUser: ApiEndpoint<
    unknown,
    { id: string },
    Record<string, string>,
    User
> = {
    method: "GET",
    path: "/users/:id",

    async handler(request) {
        const user = await userService.findById(
            request.params.id,
        );

        return {
            status: 200,
            data: user,
        };
    },
};

const createUser: ApiEndpoint<
    CreateUserBody,
    Record<string, string>,
    Record<string, string>,
    User
> = {
    method: "POST",
    path: "/users",

    async handler(request) {
        const user = await userService.create(
            request.body,
        );

        return {
            status: 201,
            data: user,
        };
    },
};

api.registerEndpoint(getUsers);
api.registerEndpoint(getUser);
api.registerEndpoint(createUser);
```

Your application can therefore build an API incrementally:

```text
/users
/users/:id
/orders
/orders/:id
/products
/products/:id
```

without requiring the API Module itself to know anything about the application's domain.

## Finding an Endpoint

The API Module also exposes registered endpoints through `getEndpoint()`.

```ts
const endpoint = api.getEndpoint(
    "GET",
    "/users",
);
```

This allows the surrounding server implementation to resolve a registered endpoint and execute its handler.

The API Module therefore acts as the registry for API contracts, while the actual HTTP server integration can be responsible for translating an incoming HTTP request into an `ApiRequest` and passing the response back to the HTTP layer.

## A Complete Example

A small server API can therefore look like this:

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

const api = new ApiModule();

const createPost: ApiEndpoint<
    CreatePostBody,
    Record<string, string>,
    Record<string, string>,
    Post
> = {
    method: "POST",
    path: "/posts",

    middleware: [
        "require-auth",
    ],

    async handler(request) {
        const post = await postService.create(
            request.body,
        );

        return {
            status: 201,
            data: post,
        };
    },
};

const getPost: ApiEndpoint<
    unknown,
    { id: string },
    Record<string, string>,
    Post
> = {
    method: "GET",
    path: "/posts/:id",

    async handler(request) {
        const post = await postService.findById(
            request.params.id,
        );

        return {
            status: 200,
            data: post,
        };
    },
};

api.registerEndpoint(createPost);
api.registerEndpoint(getPost);
```

The important distinction is that the endpoint definitions contain the API contract and application behavior, while Phestus and the surrounding server infrastructure are responsible for making those endpoints available over HTTP.

Once the server API has been created, the same endpoint definitions can be consumed by the API Client Module.
