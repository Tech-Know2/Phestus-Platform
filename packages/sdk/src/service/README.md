# Phestus Service

The `PhestusService` interface defines the data, schema, and API operations that Phestus expects from an application backend.

Phestus does not depend on a specific CMS, database, or API system. Instead, a service implements the `PhestusService` interface and translates Phestus operations into the backend's native API.

## What is a Service?

A service is the application's primary data and schema access layer.

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

The service exposes two primary capabilities:

```text
PhestusService
│
├── data
│   └── Data access and queries
│
└── schema
    └── Schema management
```

This keeps data access and schema management separate while providing modules with a consistent backend-independent API.

For example:

```ts
const result = await context.service.data.find("products", {
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

# Basic Data Operations

Data operations are exposed through `service.data`.

## Find

```ts
await service.data.find("products");
```

## Find with a Query

```ts
await service.data.find("products", {
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

## Find by ID

```ts
await service.data.findById(
    "products",
    "123",
);
```

## Count

```ts
await service.data.count("products", {
    where: {
        fields: {
            status: {
                equals: "active",
            },
        },
    },
});
```

## Create

```ts
await service.data.create(
    "products",
    {
        name: "Example Product",
        price: 100,
    },
);
```

## Update

```ts
await service.data.update(
    "products",
    "123",
    {
        price: 150,
    },
);
```

## Delete

```ts
await service.data.delete(
    "products",
    "123",
);
```

---

# Queries

Phestus queries are backend-independent.

Queries are passed to the `service.data` operations that support them.

A service implementation is responsible for translating the query into the native query language of the backend.

For example:

```ts
const products = await service.data.find("products", {
    where: {
        fields: {
            status: {
                equals: "active",
            },
        },
    },
});
```

A module does not need to know whether this becomes a Payload query, GROQ query, SQL query, or another backend-specific operation.

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
const products = await service.data.find<Product>(
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

# Schemas

`PhestusService` is also responsible for managing the schemas required by Phestus modules.

Schema operations are exposed through `service.schema`.

This allows Phestus to remain independent of the underlying CMS or database while still allowing modules to define the data structures they require.

```text
Phestus Module
      │
      │ PhestusSchema
      ▼

PhestusService.schema
      │
      ▼

Backend Schema
      |
      ├── Payload Collection
      ├── Sanity Type
      ├── Directus Collection
      └── Custom Database Schema
```

A module should define its schema using the Phestus schema format rather than defining a Payload, Sanity, or database-specific schema directly.

## Defining a Schema

A basic schema can look like this:

```ts
const ProductSchema: PhestusSchema = {
    slug: "products",
    name: "Products",
    version: "0.1.0",
    fields: {
        id: {
            type: "string",
            required: true,
            unique: true,
        },
        name: {
            type: "string",
            required: true,
        },
        price: {
            type: "number",
            required: true,
        },
        description: {
            type: "text",
        },
        active: {
            type: "boolean",
            default: true,
        },
    },
    options: {
        timestamps: true,
    },
};
```

The service implementation translates this schema into the native schema representation of the backend.

For example:

```text
PhestusSchema
      │
      ├──────────────► Payload Collection
      │
      ├──────────────► Sanity Document Type
      │
      ├──────────────► Directus Collection
      │
      └──────────────► Custom Database Table
```

## Schema Fields

Phestus provides backend-independent field types.

```text
string
number
boolean
date
text
email
url
richText
json
array
object
relationship
```

For example:

```ts
const UserSchema: PhestusSchema = {
    slug: "users",
    name: "Users",
    version: "0.1.0",
    fields: {
        name: {
            type: "string",
            required: true,
        },
        email: {
            type: "email",
            required: true,
            unique: true,
        },
        bio: {
            type: "text",
        },
        settings: {
            type: "json",
        },
        active: {
            type: "boolean",
            default: true,
        },
    },
};
```

## Relationships

Schemas can define relationships between collections.

```ts
const OrderSchema: PhestusSchema = {
    slug: "orders",
    name: "Orders",
    version: "0.1.0",
    fields: {
        customer: {
            type: "relationship",
            relation: {
                collection: "users",
            },
        },
        total: {
            type: "number",
            required: true,
        },
    },
};
```

A relationship can also represent multiple records:

```ts
products: {
    type: "relationship",
    relation: {
        collection: "products",
        many: true,
    },
},
```

The service determines how the relationship is represented by the underlying backend.

## Nested Objects

Schemas can define structured objects:

```ts
const SettingsSchema: PhestusSchema = {
    slug: "settings",
    name: "Settings",
    version: "0.1.0",
    fields: {
        name: {
            type: "string",
            required: true,
        },
        metadata: {
            type: "object",
            fields: {
                theme: {
                    type: "string",
                },
                notifications: {
                    type: "boolean",
                },
            },
        },
    },
};
```

## Arrays

Arrays can define the type of their items:

```ts
tags: {
    type: "array",
    items: {
        type: "string",
    },
},
```

This allows a schema to express structured data without depending on a specific backend's field syntax.

## Validation

Fields can define common validation rules:

```ts
const ProductSchema: PhestusSchema = {
    slug: "products",
    name: "Products",
    version: "0.1.0",
    fields: {
        name: {
            type: "string",
            required: true,
            validation: {
                minLength: 3,
                maxLength: 100,
            },
        },
        price: {
            type: "number",
            validation: {
                min: 0,
                max: 100000,
            },
        },
    },
};
```

The service is responsible for translating these validation rules into the capabilities supported by the underlying backend.

---

# Schema Management

The service exposes schema management through `service.schema`.

```ts
interface PhestusSchemaService {
    get(
        collection: string,
    ): Promise<PhestusSchema | null>;

    exists(
        collection: string,
    ): Promise<boolean>;

    create(
        collection: string,
        schema: PhestusSchema,
    ): Promise<void>;

    update(
        collection: string,
        schema: PhestusSchema,
    ): Promise<void>;

    ensure(
        collection: string,
        schema: PhestusSchema,
    ): Promise<void>;
}
```

## Get a Schema

```ts
const schema = await service.schema.get(
    "products",
);
```

## Check if a Schema Exists

```ts
const exists = await service.schema.exists(
    "products",
);
```

## Create a Schema

```ts
await service.schema.create(
    "products",
    ProductSchema,
);
```

## Update a Schema

```ts
await service.schema.update(
    "products",
    ProductSchema,
);
```

## Ensure a Schema

Modules will generally use `ensure()` rather than manually checking whether a schema exists.

```ts
await context.service.schema.ensure(
    "products",
    ProductSchema,
);
```

`ensure()` allows the service to determine whether the schema needs to be created or updated.

This keeps backend-specific schema management out of modules.

---

# Modules and Schemas

Modules can define the schemas required for their functionality.

For example, a Job module may define:

```ts
const JobSchema: PhestusSchema = {
    slug: "jobs",
    name: "Jobs",
    version: "0.1.0",
    fields: {
        id: {
            type: "string",
            required: true,
            unique: true,
        },
        name: {
            type: "string",
            required: true,
        },
        status: {
            type: "string",
            required: true,
            indexed: true,
        },
        attempts: {
            type: "number",
            default: 0,
        },
        payload: {
            type: "json",
        },
    },
    options: {
        timestamps: true,
    },
};
```

The module can then ensure its schema during initialization:

```ts
async initialize(
    context: PhestusContext,
): Promise<void> {
    await context.service.schema.ensure(
        "jobs",
        JobSchema,
    );
}
```

The module can then use the same service for data operations:

```ts
const jobs = await context.service.data.find<Job>(
    "jobs",
    {
        where: {
            fields: {
                status: {
                    equals: "pending",
                },
            },
        },
    },
);
```

This means the Job module does not need to know whether `jobs` is implemented as:

```text
Payload Collection
Sanity Type
Directus Collection
SQL Table
MongoDB Collection
Custom Backend
```

The service handles that translation.

---

# Schema Versioning

Every schema has a version:

```ts
const ProductSchema: PhestusSchema = {
    slug: "products",
    name: "Products",
    version: "0.1.0",
    fields: {
        // ...
    },
};
```

The version allows Phestus to determine which version of a schema a module expects.

This becomes important when schema migrations are introduced.

```text
Schema v0.1.0

      │

      │ migration

      ▼

Schema v0.2.0

      │

      │ migration

      ▼

Schema v1.0.0
```

For v0.1, schema management and schema versioning are intentionally separate from a full migration system.

A future version of Phestus may expose explicit migration operations for moving existing data and schemas between versions.

---

# Service Implementations

A service is responsible for translating the Phestus API into the backend's API.

```text
Phestus Data / Schema

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

A module defines **what data and schema it needs**.

The service determines **how that data and schema are represented by the backend**.

```text
Module

 │

 ├── PhestusSchema
 │
 ├── Data Operations
 │
 └── PhestusQuery
         │
         ▼
  PhestusService
         │
         ├── data
         │
         └── schema
                 │
                 ▼
              Backend
```

The `PhestusQuery` type describes **how data should be selected**, while `PhestusService.data` provides the operations used to access and mutate that data.

This separation allows modules to remain completely independent from Payload, Sanity, Directus, SQL, MongoDB, or any other backend implementation.
