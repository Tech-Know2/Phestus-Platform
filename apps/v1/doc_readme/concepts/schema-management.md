---
title: Schema Management
description: This is a doc describing how to configure and manage data schemas within the Phestus platform.
tags:
 - phestus
 - schema
 - data
 - modules
 - providers
 - web stack
 - web framework
 - modular
order: 2
---

## Schemas

Phestus uses schemas to define the structure and behavior of application data.

Schemas are managed through the `PhestusService` and are intentionally separated from the underlying data provider. Modules can define the data they require without directly depending on a database, CMS, ORM, or other storage implementation.

The schema service is available through:

```ts
context.service.schema
```

A schema is represented by the `PhestusSchema` type:

```ts
export interface PhestusSchema {
  slug: string;
  name: string;
  version: string;
  fields: Record<string, PhestusSchemaField>;
  options?: PhestusSchemaOptions;
}
```

## Schema Fields

Each schema contains a collection of fields. Fields define the type and behavior of individual pieces of data.

Phestus supports the following field types:

```text
string
number
boolean
date
json
text
email
url
richText
array
object
relationship
```

For example:

```ts
const userSchema: PhestusSchema = {
  slug: 'users',
  name: 'Users',
  version: '1.0.0',
  fields: {
    name: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'email',
      required: true,
      unique: true,
    },
  },
}
```

Fields can define additional configuration such as:

* `label`
* `description`
* `required`
* `unique`
* `indexed`
* `default`
* `validation`
* Nested `fields`
* Array `items`
* Relationships

## Validation

Fields can define validation rules through the `validation` property.

```ts
const schema: PhestusSchema = {
  slug: 'users',
  name: 'Users',
  version: '1.0.0',
  fields: {
    username: {
      type: 'string',
      required: true,
      validation: {
        minLength: 3,
        maxLength: 32,
        pattern: '^[a-zA-Z0-9_]+$',
      },
    },
    age: {
      type: 'number',
      validation: {
        min: 18,
        max: 120,
      },
    },
  },
}
```

The available validation properties are:

```ts
interface PhestusSchemaValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}
```

The exact interpretation of these rules is handled by the service implementation.

## Relationships

Schemas can describe relationships between collections using the `relation` property.

```ts
const orderSchema: PhestusSchema = {
  slug: 'orders',
  name: 'Orders',
  version: '1.0.0',
  fields: {
    customer: {
      type: 'relationship',
      relation: {
        collection: 'users',
      },
    },
  },
}
```

Relationships can also represent multiple related records:

```ts
items: {
  type: 'relationship',
  relation: {
    collection: 'products',
    many: true,
  },
}
```

The underlying service determines how these relationships are represented and stored.

## Schema Options

Schemas can define additional behavior through `options`.

```ts
const schema: PhestusSchema = {
  slug: 'posts',
  name: 'Posts',
  version: '1.0.0',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
  },
  options: {
    timestamps: true,
    softDelete: true,
    versioning: true,
  },
}
```

Phestus currently defines the following options:

```ts
interface PhestusSchemaOptions {
  timestamps?: boolean;
  softDelete?: boolean;
  versioning?: boolean;
}
```

These options allow a service implementation to provide common data-management behavior without requiring modules to implement that behavior themselves.

## Creating a Schema

Schemas are created through the schema service.

```ts
await context.service.schema.create(
  'users',
  userSchema,
)
```

The first argument identifies the collection managed by the schema, while the second provides the schema definition.

## Retrieving a Schema

An existing schema can be retrieved with `get`.

```ts
const schema = await context.service.schema.get('users')
```

The result is either the schema or `null` when the collection does not have a schema.

## Checking for a Schema

The `exists` method can be used when only the existence of a schema is required.

```ts
const exists = await context.service.schema.exists('users')
```

This returns a boolean.

## Updating a Schema

Existing schemas can be updated through `update`.

```ts
await context.service.schema.update(
  'users',
  userSchema,
)
```

Schema versions can be used to identify changes to a schema over time.

```ts
const schema: PhestusSchema = {
  slug: 'users',
  name: 'Users',
  version: '2.0.0',
  fields: {
    name: {
      type: 'string',
    },
    email: {
      type: 'email',
    },
  },
}
```

How schema changes are applied is determined by the service implementation.

## Ensuring a Schema

The `ensure` method provides a convenient way to establish a schema without requiring the caller to first determine whether it already exists.

```ts
await context.service.schema.ensure(
  'users',
  userSchema,
)
```

This is particularly useful during module initialization when a module needs to ensure that the schemas required by its capabilities are available.

## Service Abstraction

Schema management does not directly interact with a database or CMS.

Instead, the architecture is:

```text
Module
  ↓
PhestusService
  ↓
SchemaService
  ↓
Service Adapter
  ↓
Data Provider
```

This allows the same module to define its schemas while different service implementations determine how those schemas are represented.

For example, a service adapter could translate a Phestus schema into a Payload collection, database table, or another storage model.

The module only depends on the Phestus schema API.
