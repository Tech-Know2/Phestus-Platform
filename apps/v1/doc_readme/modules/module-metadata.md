---
title: Module Metadata
description: This is a doc describing module manifests and dependencies within the Phestus platform.
tags:
 - phestus
 - modules
 - manifests
 - dependencies
 - web stack
 - web framework
 - modular
order: 3
---

## Module Manifests

Every Phestus module defines a manifest that describes the module and its requirements.

The manifest is the metadata used by Phestus to identify a module, determine its version, and understand its dependencies.

A basic manifest looks like:

```ts
const manifest: ModuleManifest = {
  slug: 'example',
  name: 'Example Module',
  version: '1.0.0',
}
```

## Module Identity

A module manifest contains three required properties:

```ts
interface ModuleManifest {
  slug: string;
  name: string;
  version: string;
}
```

* `slug` uniquely identifies the module.
* `name` is the human-readable name of the module.
* `version` identifies the module version.

The slug is used by the runtime and dependency system when referring to a module.

## Dependencies

Modules can declare dependencies on other Phestus components.

```ts
const manifest: ModuleManifest = {
  slug: 'workflow',
  name: 'Workflow',
  version: '1.0.0',
  dependencies: [
    {
      type: 'module',
      slug: 'queue',
      version: '1.0.0',
    },
  ],
}
```

Dependencies can reference three types of Phestus components:

```ts
type PhestusDependencyType =
  | 'plugin'
  | 'module'
  | 'provider'
```

A dependency also specifies the required version and can optionally be marked as optional:

```ts
{
  type: 'module',
  slug: 'queue',
  version: '1.0.0',
  optional: true,
}
```

This allows modules to explicitly describe the components they require without directly managing their installation or lifecycle.

## Provider Requirements

Modules can also declare whether they require a provider.

```ts
const manifest: ModuleManifest = {
  slug: 'queue',
  name: 'Queue',
  version: '1.0.0',
  provider: {
    required: true,
    multiple: false,
  },
}
```

The provider configuration contains two optional properties:

```ts
provider?: {
  required?: boolean;
  multiple?: boolean;
}
```

`required` indicates whether the module requires a provider to operate.

`multiple` indicates whether multiple providers can be associated with the module.

This allows a module to define its provider requirements while leaving the actual provider implementation separate from the module itself.

## Module Definition

The manifest is part of the larger `PhestusModule` definition:

```ts
export interface PhestusModule {
  manifest: ModuleManifest;

  initialize?(context: PhestusContext): Promise<void>;
  shutdown?(context: PhestusContext): Promise<void>;
}
```

This means the manifest describes the module, while the module lifecycle methods provide its runtime behavior.

A complete module might therefore look like:

```ts
const module: PhestusModule = {
  manifest: {
    slug: 'example',
    name: 'Example Module',
    version: '1.0.0',
  },

  async initialize(context) {
    // Initialize module
  },

  async shutdown(context) {
    // Shut down module
  },
}
```

Module manifests provide the metadata Phestus needs to understand modules and their relationships before they are initialized.
