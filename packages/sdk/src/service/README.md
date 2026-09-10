# Phestus Service

The `PhestusService` interface defines the data and API operations that Phestus expects from an application backend.

Phestus does not depend on a specific CMS, database, or API system. Instead, a service implements the `PhestusService` interface and translates Phestus operations into the backend's native API.

## What is a Service?

A service is the application's primary data access layer.

```text
Phestus
   │
   │ PhestusService
   ▼
┌──────────┬──────────┬──────────┐
│ Payload  │  Sanity  │  Custom  │
│ Service  │  Service │  Service │
└──────────┴──────────┴──────────┘
```

For example:

```ts
class PhestusPayload implements PhestusService {
    // Payload implementation
}
```

Phestus modules interact with the service without knowing which backend is being used.

```ts
const result = await context.service.find("products", {
    where: {
        fields: {
            status: {
                equals: "active",
            },
        },
    },
});
```

The Payload service would translate this into a Payload query, while a Sanity service could translate the same query into GROQ.

---

## Basic Operations

### Find

```ts
await service.find("products");
```

### Find with a query

```ts
await service.find("products", {
    where: {
        fields: {
            status: {
                equals: "active",
            },
        },
    },
    limit: 20,
});
```

### Find by ID

```ts
await service.findById(
    "products",
    "123",
);
```

### Count

```ts
await service.count("products", {
    where: {
        fields: {
            status: {
                equals: "active",
            },
        },
    },
});
```

### Create

```ts
await service.create(
    "products",
    {
        name: "Example Product",
        price: 100,
    },
);
```

### Update

```ts
await service.update(
    "products",
    "123",
    {
        price: 150,
    },
);
```

### Delete

```ts
await service.delete(
    "products",
    "123",
);
```

---

# Queries

Phestus queries are backend-independent.

## Field Conditions

```ts
{
    where: {
        fields: {
            status: {
                equals: "active",
            },
            price: {
                greaterThan: 100,
            },
        },
    },
}
```

## Available Operators

```text
equals
notEquals
contains
startsWith
endsWith
greaterThan
greaterThanOrEqual
lessThan
lessThanOrEqual
in
notIn
exists
```

For example:

```ts
{
    where: {
        fields: {
            title: {
                contains: "shirt",
            },
            price: {
                lessThanOrEqual: 100,
            },
            category: {
                in: ["clothing", "accessories"],
            },
        },
    },
}
```

## AND

```ts
{
    where: {
        and: [
            {
                fields: {
                    status: {
                        equals: "active",
                    },
                },
            },
            {
                fields: {
                    price: {
                        greaterThan: 100,
                    },
                },
            },
        ],
    },
}
```

## OR

```ts
{
    where: {
        or: [
            {
                fields: {
                    status: {
                        equals: "active",
                    },
                },
            },
            {
                fields: {
                    status: {
                        equals: "pending",
                    },
                },
            },
        ],
    },
}
```

## NOT

```ts
{
    where: {
        not: {
            fields: {
                status: {
                    equals: "deleted",
                },
            },
        },
    },
}
```

## Sorting

```ts
{
    sort: "-createdAt",
}
```

Multiple fields:

```ts
{
    sort: [
        "-createdAt",
        "name",
    ],
}
```

A leading `-` indicates descending order.

## Pagination

```ts
{
    limit: 20,
    offset: 0,
}
```

## Selecting Fields

```ts
{
    select: [
        "id",
        "name",
        "price",
    ],
}
```

## Combined Query

```ts
const products = await service.find<Product>(
    "products",
    {
        where: {
            fields: {
                status: {
                    equals: "active",
                },
                price: {
                    greaterThan: 50,
                },
            },
        },

        sort: "-createdAt",

        limit: 20,

        offset: 0,

        select: [
            "id",
            "name",
            "price",
        ],
    },
);
```

---

# Service Implementations

A service is responsible for translating the Phestus API into the backend's API.

```text
Phestus Query
      │
      ▼
Phestus Service
      │
      ▼
Backend API
```

Example implementations could include:

```text
@phestus/payload
@phestus/sanity
@phestus/directus
@phestus/custom
```

The goal is that Phestus modules never need to know which service implementation is being used.
