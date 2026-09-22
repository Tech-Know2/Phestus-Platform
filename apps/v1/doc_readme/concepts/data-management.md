---
title: Data Management
description: This is a doc describing how to read, create, update, delete, and query data within the Phestus platform.
tags:
 - phestus
 - schema
 - data
 - modules
 - providers
 - web stack
 - web framework
 - modular
order: 3
---

## Data

Phestus provides a data service for interacting with application records.

The data service is exposed through:

```ts
context.service.data
```

It provides a consistent API for querying and mutating data without requiring modules to communicate directly with a specific database, CMS, ORM, or storage provider.

The primary operations are:

```text
find
findById
count
create
update
delete
```

## Finding Data

Records can be queried using `find`.

```ts
const users = await context.service.data.find(
  'users',
)
```

A query can optionally be provided:

```ts
const users = await context.service.data.find(
  'users',
  {
    limit: 10,
    offset: 0,
  },
)
```

The result is a `FindResult`:

```ts
interface FindResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  offset: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
```

This provides both the returned records and pagination information.

## Finding a Record by ID

When a specific record is needed, `findById` can be used.

```ts
const user = await context.service.data.findById(
  'users',
  userId,
)
```

The result is either the requested record or `null` when no matching record exists.

## Counting Records

The `count` method returns the number of records matching an optional query.

```ts
const total = await context.service.data.count(
  'users',
)
```

A query can also be provided:

```ts
const total = await context.service.data.count(
  'users',
  {
    where: {
      fields: {
        status: {
          equals: 'active',
        },
      },
    },
  },
)
```

## Queries

Queries are represented by `PhestusQuery`.

```ts
interface PhestusQuery {
  where?: PhestusWhere;
  sort?: string | string[];
  limit?: number;
  offset?: number;
  select?: string[];
}
```

Queries can therefore control:

* Filtering
* Sorting
* Pagination
* Selected fields

## Filtering

Filtering is performed through `where`.

Field conditions are defined through `fields`.

```ts
const users = await context.service.data.find(
  'users',
  {
    where: {
      fields: {
        email: {
          equals: 'john@example.com',
        },
      },
    },
  },
)
```

Multiple fields can be queried at the same time:

```ts
const users = await context.service.data.find(
  'users',
  {
    where: {
      fields: {
        status: {
          equals: 'active',
        },
        age: {
          greaterThanOrEqual: 18,
        },
      },
    },
  },
)
```

## Query Operators

Phestus defines the following query operators:

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
const users = await context.service.data.find(
  'users',
  {
    where: {
      fields: {
        name: {
          startsWith: 'John',
        },
      },
    },
  },
)
```

Values can be strings, numbers, booleans, dates, `null`, or arrays of supported query values.

## Combining Conditions

Queries can combine conditions using `and`, `or`, and `not`.

For example:

```ts
const users = await context.service.data.find(
  'users',
  {
    where: {
      and: [
        {
          fields: {
            status: {
              equals: 'active',
            },
          },
        },
        {
          fields: {
            age: {
              greaterThanOrEqual: 18,
            },
          },
        },
      ],
    },
  },
)
```

An `or` condition can be used when any of several conditions should match:

```ts
const users = await context.service.data.find(
  'users',
  {
    where: {
      or: [
        {
          fields: {
            role: {
              equals: 'admin',
            },
          },
        },
        {
          fields: {
            role: {
              equals: 'moderator',
            },
          },
        },
      ],
    },
  },
)
```

A condition can also be negated using `not`.

## Sorting

Records can be sorted using `sort`.

```ts
const users = await context.service.data.find(
  'users',
  {
    sort: 'createdAt',
  },
)
```

Multiple sort values can be provided:

```ts
const users = await context.service.data.find(
  'users',
  {
    sort: ['createdAt', 'name'],
  },
)
```

The interpretation of sort values is handled by the service implementation.

## Pagination

Pagination is controlled through `limit` and `offset`.

```ts
const users = await context.service.data.find(
  'users',
  {
    limit: 20,
    offset: 40,
  },
)
```

The returned `FindResult` contains the pagination state:

```ts
{
  docs,
  totalDocs,
  limit,
  offset,
  hasNextPage,
  hasPrevPage,
}
```

## Selecting Fields

Specific fields can be requested using `select`.

```ts
const users = await context.service.data.find(
  'users',
  {
    select: [
      'name',
      'email',
    ],
  },
)
```

The service implementation determines how field selection is translated to the underlying provider.

## Creating Data

Records are created with `create`.

```ts
const user = await context.service.data.create(
  'users',
  {
    name: 'John Doe',
    email: 'john@example.com',
  },
)
```

The returned value is the created record.

## Updating Data

Existing records can be updated with `update`.

```ts
const user = await context.service.data.update(
  'users',
  userId,
  {
    name: 'Jane Doe',
  },
)
```

The collection and record ID identify the record, while the final argument contains the data to update.

## Deleting Data

Records can be deleted with `delete`.

```ts
const user = await context.service.data.delete(
  'users',
  userId,
)
```

The deleted record is returned by the service.

## Data and Schemas

Data management and schema management represent two different responsibilities within the service layer.

Schema management defines what the data looks like:

```text
Schema
  ↓
Fields
  ↓
Types
  ↓
Validation
  ↓
Relationships
```

Data management operates on records conforming to that schema:

```text
Data
  ↓
Find
  ↓
Create
  ↓
Update
  ↓
Delete
```

Together, they provide the foundation for provider-independent data management in Phestus.

## Service Abstraction

The data service does not require modules to know how records are stored.

The architecture is:

```text
Module
  ↓
PhestusService
  ↓
DataService
  ↓
Service Adapter
  ↓
Data Provider
```

A module can therefore use:

```ts
await context.service.data.find(
  'users',
)
```

without knowing whether the underlying implementation uses Payload, PostgreSQL, another database, or another data source.

The service adapter is responsible for translating Phestus queries and data operations into the implementation-specific API.

This keeps modules focused on application capabilities while the service layer manages the details of data storage and retrieval.