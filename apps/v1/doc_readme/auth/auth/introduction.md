---
title: Introduction to Authentication
description: Learn how authentication and authorization work in the Phestus Auth Module.
tags:
 - phestus
 - authentication
 - authorization
 - auth
 - providers
 - modules
 - web stack
 - web framework
 - modular
order: 1
---

# Introduction to Authentication

The Auth Module provides authentication and authorization capabilities to the Phestus platform.

Rather than implementing a specific authentication system directly inside the module, Phestus separates the authentication interface from its implementation.

The Auth Module defines **what authentication can do**, while an `AuthProvider` defines **how authentication is performed**.

This allows an application to use different authentication systems without changing the modules that depend on authentication.

## Authentication and Authorization

Phestus separates two related concepts:

**Authentication** determines who is making a request.

**Authorization** determines whether that authenticated actor is allowed to perform an action.

The Auth Module exposes both capabilities:

```ts
export class AuthModule implements PhestusModule {
    // ...

    authenticate(options: AuthenticateOptions) {
        return this.provider.authenticate(options);
    }

    authorize(options: AuthorizeOptions) {
        return this.provider.authorize(options);
    }
}
```

A typical request may therefore follow this flow:

```text
Request
   │
   ▼
Authenticate
   │
   ▼
Auth Actor
   │
   ▼
Authorize
   │
   ▼
Application Logic
```

Authentication and authorization can also be used independently when an application requires it.

## The Auth Module

The Auth Module is intentionally small.

Its primary responsibility is to expose the authentication and authorization capabilities provided by an `AuthProvider`.

```ts
export class AuthModule implements PhestusModule {
    manifest = {
        slug: "auth",
        name: "Auth Module",
        version: "0.1.0",
    };

    constructor(
        private readonly provider: AuthProvider,
    ) {}

    authenticate(options: AuthenticateOptions) {
        return this.provider.authenticate(options);
    }

    authorize(options: AuthorizeOptions) {
        return this.provider.authorize(options);
    }
}
```

The module does not need to know whether authentication is implemented using sessions, tokens, an external identity provider, an API key, or another mechanism.

That responsibility belongs to the provider.

## Auth Providers

An `AuthProvider` implements the actual authentication and authorization behavior.

```ts
export interface AuthProvider extends PhestusProvider {
    authenticate(
        options: AuthenticateOptions,
    ): Promise<AuthActor | null>;

    authorize(
        options: AuthorizeOptions,
    ): Promise<boolean>;
}
```

The provider therefore supplies two operations:

* `authenticate()` — resolves a request to an authenticated actor.
* `authorize()` — determines whether an actor can perform an action.

Because the provider implements the `PhestusProvider` interface, it can be supplied to the Auth Module as an implementation of the authentication capability.

## Auth Actors

Successful authentication returns an `AuthActor`.

```ts
export interface AuthActor {
    id: string;
    type: string;
    metadata?: Record<string, unknown>;
}
```

An actor represents the identity associated with a request.

The Auth Module does not require the actor to represent a particular kind of user. The `type` field allows applications to distinguish between different actor types.

For example:

```ts
const actor: AuthActor = {
    id: "user_123",
    type: "user",
};
```

An application can also provide additional information through `metadata`:

```ts
const actor: AuthActor = {
    id: "user_123",
    type: "user",
    metadata: {
        email: "user@example.com",
        organization: "example",
    },
};
```

The structure of the metadata is intentionally flexible so that individual authentication providers can supply information relevant to their implementation.

## Authentication

Authentication receives an `AuthenticateOptions` object:

```ts
export interface AuthenticateOptions {
    request: unknown;
}
```

The request is intentionally typed as `unknown`.

The Auth Module does not assume a specific HTTP framework or request implementation. A provider can interpret the request according to the environment in which it is being used.

For example, a provider may inspect:

* Headers
* Cookies
* Authorization tokens
* Sessions
* API keys
* Request metadata

The provider determines how those values are interpreted.

If authentication succeeds, the provider returns an actor:

```ts
return {
    id: "user_123",
    type: "user",
};
```

If no authenticated actor can be established, the provider returns `null`.

```ts
return null;
```

## Authorization

Authorization receives an actor and an action:

```ts
export interface AuthorizeOptions {
    actor: AuthActor;
    action: string;
    resource?: unknown;
    context?: Record<string, unknown>;
    provider?: string;
}
```

The actor represents **who** is making the request.

The action represents **what** they are attempting to do.

For example:

```ts
await auth.authorize({
    actor,
    action: "posts.create",
});
```

Applications can optionally provide a resource:

```ts
await auth.authorize({
    actor,
    action: "posts.update",
    resource: post,
});
```

Additional information can be supplied through `context`:

```ts
await auth.authorize({
    actor,
    action: "posts.update",
    resource: post,
    context: {
        organizationId: "org_123",
    },
});
```

The provider returns a boolean indicating whether the operation is authorized:

```ts
const allowed = await auth.authorize({
    actor,
    action: "posts.create",
});
```

## Authentication Providers and Modules

The separation between the Auth Module and Auth Provider follows the broader Phestus architecture.

```text
Application
     │
     ▼
Auth Module
     │
     ▼
Auth Provider
     │
     ▼
Authentication System
```

The module exposes the capability to the rest of the application, while the provider supplies the implementation.

This allows other modules to depend on authentication without depending on a specific authentication technology.

For example, the API Module can depend on the Auth Module:

```text
API Module
    │
    ▼
Auth Module
    │
    ▼
Auth Provider
```

The API Module does not need to know how the provider authenticates requests.

## Auth and Middleware

Authentication can be combined with the Middleware Module to protect API endpoints.

A middleware operation can authenticate a request and then continue only when an actor has been established:

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
Auth Actor
     │
     ▼
Authorization Middleware
     │
     ▼
API Handler
```

This keeps the responsibilities separate:

| Component         | Responsibility                              |
| ----------------- | ------------------------------------------- |
| Auth Module       | Exposes authentication and authorization    |
| Auth Provider     | Implements authentication and authorization |
| Middleware Module | Controls request execution                  |
| API Module        | Defines API endpoints                       |

## A Small Authentication Example

Once an Auth Module has been created with a provider, authentication can be performed through the module:

```ts
const actor = await auth.authenticate({
    request,
});

if (!actor) {
    // No authenticated actor
}
```

Authorization can then be performed using the resulting actor:

```ts
const allowed = await auth.authorize({
    actor,
    action: "posts.create",
});

if (!allowed) {
    // Actor is not authorized
}
```

The application therefore interacts with a consistent Auth Module interface while the provider handles the implementation details.

## Summary

The Phestus Auth Module provides a small abstraction around authentication and authorization.

Its architecture can be summarized as:

```text
Auth Module
    │
    ├── authenticate()
    │       │
    │       ▼
    │   Auth Provider
    │       │
    │       ▼
    │   Auth Actor
    │
    └── authorize()
            │
            ▼
        Auth Provider
            │
            ▼
       true / false
```

The module defines the capability, the provider implements it, and the rest of the Phestus application can consume authentication without being coupled to a particular authentication system.
