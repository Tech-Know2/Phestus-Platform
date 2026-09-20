---
title: Logger Creation
description: A guide on how to create custom loggers and integrate them into Phestus
tags:
  - phestus
  - logger
  - logging
  - web stack
  - web framework
  - modular
order: 3
---

## Creating a Logger

Phestus uses a simple `Logger` interface for application logging. You can create your own logger implementation using the standard console methods or connect it to an external logging system.

A basic logger can be created like this:

```ts
import type { Logger } from '@phestus/sdk'

export const logger = {
    debug(message: string, ...args: unknown[]): void {
        console.debug(message, ...args)
    },

    info(message: string, ...args: unknown[]): void {
        console.info(message, ...args)
    },

    warn(message: string, ...args: unknown[]): void {
        console.warn(message, ...args)
    },

    error(message: string, ...args: unknown[]): void {
        console.error(message, ...args)
    },
} satisfies Logger
```

The `Logger` interface provides four logging levels:

* `debug` - Detailed information useful during development.
* `info` - General application information.
* `warn` - Warnings that do not necessarily prevent the application from running.
* `error` - Errors and failures.

The logger can then be provided to the Phestus configuration and used throughout the runtime.
