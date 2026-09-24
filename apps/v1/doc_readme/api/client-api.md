---
title: Client API
description: Learn how to use the Phestus API Client Module to communicate with a Phestus Server API.
tags:
 - phestus
 - api
 - api-client
 - client
 - requests
 - typing
 - modules
 - web stack
 - web framework
 - modular
order: 3
---

# Client API

The Phestus API Client Module provides a small client for communicating with a Phestus Server API.

The Server API defines endpoints.

The Client API consumes those endpoint definitions.

This allows the same `ApiEndpoint` contract to describe both sides of the request:

```text
                 ApiEndpoint
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
     Server API              Client API
          │                       │
       handler                 request()
          │                       │
          └──────── HTTP ────────┘
```

The client is intentionally small. It is responsible for constructing requests, replacing path parameters, adding query parameters and headers, sending the HTTP request, and returning the response.

## Installing the Client Module

The client module is provided separately from the server API:

```ts
import {
    APIClientModule,
} from "@phestus/api-client-module";
```

The module depends on the API Module because it consumes the same `ApiEndpoint` definitions:

```text
API Client Module
        │
        ▼
    API Module
```

Create the client with a base URL:

```ts
const client = new APIClientModule({
    baseUrl: "https://api.example.com",
});
```

The `baseUrl` is the server that the client will communicate with.

For a local application, this might be:

```ts
const client = new APIClientModule({
    baseUrl: "http://localhost:3000",
});
```

## Client Options

The client accepts:

```ts
export interface ApiClientOptions {
    baseUrl: string;
    headers?: Record<string, string>;
}
```

The base URL is required.

Headers are optional and are applied to requests made through the client.

For example:

```ts
const client = new APIClientModule({
    baseUrl: "https://api.example.com",
    headers: {
        Authorization: "Bearer token",
    },
});
```

This is useful when a client needs to send common headers with every request.

## Making a Request

The main client method is:

```ts
client.request(endpoint, request)
```

The endpoint describes what is being called.

The request contains the values needed by that endpoint.

For example:

```ts
const response = await client.request(
    getUsers,
);
```

The client reads the endpoint's:

```ts
method
path
```

and constructs the HTTP request automatically.

## Using a GET Endpoint

Suppose the server defines:

```ts
interface User {
    id: string;
    name: string;
}

const getUsers: ApiEndpoint<
    unknown,
    Record<string, string>,
    Record<string, string>,
    User[]
> = {
    method: "GET",
    path: "/users",

    async handler() {
        // ...

        return {
            status: 200,
            data: [],
        };
    },
};
```

The client can call it directly:

```ts
const response = await client.request(
    getUsers,
);

console.log(response.status);
console.log(response.data);
```

Because the endpoint defines `User[]` as its response type, the response data is typed accordingly.

## Path Parameters

Consider an endpoint with a path parameter:

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
        // ...

        return {
            status: 200,
            data: user,
        };
    },
};
```

The client supplies the parameter through `params`:

```ts
const response = await client.request(
    getUser,
    {
        params: {
            id: "123",
        },
    },
);
```

The client converts:

```text
/users/:id
```

into:

```text
/users/123
```

Path parameters are URL encoded automatically.

For example:

```ts
params: {
    id: "user/example",
}
```

will be encoded before being placed into the URL.

## Missing Path Parameters

The client validates that every path parameter has been provided.

For example:

```ts
await client.request(getUser);
```

would fail because `id` is required by:

```text
/users/:id
```

The client throws:

```text
Missing path parameter: id
```

This catches incorrectly constructed requests before they are sent to the server.

## Query Parameters

Query parameters are supplied through `query`.

For example:

```ts
interface UserQuery {
    search: string;
    limit: string;
}

const listUsers: ApiEndpoint<
    unknown,
    Record<string, string>,
    UserQuery,
    User[]
> = {
    method: "GET",
    path: "/users",

    async handler(request) {
        // ...

        return {
            status: 200,
            data: [],
        };
    },
};
```

The client can call:

```ts
const response = await client.request(
    listUsers,
    {
        query: {
            search: "cooper",
            limit: "20",
        },
    },
);
```

The resulting URL will contain:

```text
/users?search=cooper&limit=20
```

The client uses `URLSearchParams` internally, so query values are encoded as part of URL construction.

## Request Bodies

POST, PUT, and PATCH endpoints can provide a request body.

For example:

```ts
interface CreateUserBody {
    name: string;
    email: string;
}

const createUser: ApiEndpoint<
    CreateUserBody,
    Record<string, string>,
    Record<string, string>,
    User
> = {
    method: "POST",
    path: "/users",

    async handler(request) {
        // ...

        return {
            status: 201,
            data: user,
        };
    },
};
```

The client supplies the body:

```ts
const response = await client.request(
    createUser,
    {
        body: {
            name: "Cooper",
            email: "cooper@example.com",
        },
    },
);
```

The client serializes the body as JSON and sends:

```http
Content-Type: application/json
```

automatically.

## Combining Parameters, Query, and Body

The three request sections can be used independently or together.

For example:

```ts
interface UpdatePostBody {
    title: string;
    content: string;
}

interface UpdatePostParams {
    id: string;
}

interface UpdatePostQuery {
    publish: string;
}

const updatePost: ApiEndpoint<
    UpdatePostBody,
    UpdatePostParams,
    UpdatePostQuery,
    Post
> = {
    method: "PATCH",
    path: "/posts/:id",

    async handler(request) {
        // ...

        return {
            status: 200,
            data: post,
        };
    },
};
```

The client can provide all three:

```ts
const response = await client.request(
    updatePost,
    {
        params: {
            id: "123",
        },

        query: {
            publish: "true",
        },

        body: {
            title: "Updated Post",
            content: "Updated content",
        },
    },
);
```

The resulting request is conceptually:

```text
PATCH /posts/123?publish=true
```

with the JSON body:

```json
{
    "title": "Updated Post",
    "content": "Updated content"
}
```

## Client Headers

Headers can be configured when the client is created:

```ts
const client = new APIClientModule({
    baseUrl: "https://api.example.com",
    headers: {
        Authorization: "Bearer token",
        "X-Client-Version": "1.0.0",
    },
});
```

These headers are included with requests made by the client.

The client also automatically sets:

```http
Content-Type: application/json
```

when constructing requests.

## Authentication

The API Client does not implement a particular authentication system.

Instead, it provides the ability to send the headers required by the server's authentication system.

For example:

```ts
const client = new APIClientModule({
    baseUrl: "https://api.example.com",
    headers: {
        Authorization: "Bearer token",
    },
});
```

The server can then use its Auth and Middleware modules to authenticate the request.

This keeps authentication independent from the HTTP client.

The overall flow becomes:

```text
Client
  │
  │ Authorization header
  ▼
Server API
  │
  ▼
Middleware
  │
  ▼
Auth
  │
  ▼
Endpoint Handler
```

For details about how authentication works on the server, see the Auth documentation.

## Using Shared Endpoint Definitions

One of the main benefits of the client module is that the endpoint definition can be shared.

For example, define the endpoint:

```ts
export interface GetUserParams {
    id: string;
}

export interface User {
    id: string;
    name: string;
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

The server registers it:

```ts
api.registerEndpoint(getUser);
```

The client can import the same endpoint:

```ts
import {
    getUser,
} from "./api/get-user";
```

and call it:

```ts
const response = await client.request(
    getUser,
    {
        params: {
            id: "123",
        },
    },
);
```

This means the API contract does not need to be manually recreated on the client.

## Organizing API Definitions

For larger applications, endpoint definitions can be organized into their own files.

For example:

```text
api/
├── users/
│   ├── get-user.ts
│   ├── list-users.ts
│   └── create-user.ts
│
├── posts/
│   ├── get-post.ts
│   ├── list-posts.ts
│   └── create-post.ts
│
└── index.ts
```

An endpoint file might contain:

```ts
import type {
    ApiEndpoint,
} from "@phestus/api-module";

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

The server can register the endpoint:

```ts
api.registerEndpoint(getUser);
```

while the client imports the same definition:

```ts
import {
    getUser,
} from "./api/users/get-user";
```

This provides a single source for the API contract.

## A Complete Client Example

A complete client setup might look like this:

```ts
import {
    APIClientModule,
} from "@phestus/api-client-module";

import {
    getUser,
    createUser,
} from "./api";

const client = new APIClientModule({
    baseUrl: "https://api.example.com",
    headers: {
        Authorization: "Bearer token",
    },
});
```

Fetching a user:

```ts
const userResponse = await client.request(
    getUser,
    {
        params: {
            id: "123",
        },
    },
);

console.log(userResponse.data);
```

Creating a user:

```ts
const userResponse = await client.request(
    createUser,
    {
        body: {
            name: "Cooper",
            email: "cooper@example.com",
        },
    },
);

console.log(userResponse.data);
```

The client does not need to manually construct:

```text
/users/123
```

or:

```text
/users?...
```

or serialize the JSON body itself.

Those responsibilities are handled by the API Client Module.

## Server and Client Together

A complete API flow can therefore be represented as:

```text
                    Shared Endpoint
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
        Server API              Client API
             │                       │
       registerEndpoint()        request()
             │                       │
             ▼                       ▼
        API Module              HTTP Request
             │                       │
             └────────── HTTP ───────┘
                         │
                         ▼
                   Server Handler
                         │
                         ▼
                    ApiResponse
```

The Server API owns the implementation.

The Client API owns communication with that implementation.

The shared endpoint definition provides the contract between the two.

This gives Phestus a small API layer that can be composed with the rest of the platform without requiring the API module itself to own authentication, middleware, persistence, or application-specific business logic.
