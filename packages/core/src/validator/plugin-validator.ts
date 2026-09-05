import type {
    PhestusPlugin,
    PhestusDependency,
} from "@phestus/sdk";

import { ManifestValidator } from "./manifest-validator";
import { ModuleValidator } from "./module-validator";
import { ProviderValidator } from "./provider-validator";
import { ValidationError } from "../errors/validator-error";
import { ModuleRegistry } from "../registry/module-registry";

export class PluginValidator {
    constructor(
        private readonly modules: ModuleRegistry,
    ) { }

    validate(plugin: PhestusPlugin): void {
        if (!plugin) {
            throw new ValidationError(
                "Plugin cannot be undefined or null.",
            );
        }

        if (!plugin.manifest) {
            throw new ValidationError(
                "Plugin must define a manifest.",
            );
        }

        const manifest = plugin.manifest;

        ManifestValidator.validateSlug(
            manifest.slug,
            "Plugin",
        );

        ManifestValidator.validateName(
            manifest.name,
            "Plugin",
        );

        ManifestValidator.validateVersion(
            manifest.version,
            "Plugin",
        );

        this.validateDependencies(plugin);
        this.validateModules(plugin);
        this.validateProviders(plugin);
        this.validateProvides(plugin);
    }

    private validateDependencies(
        plugin: PhestusPlugin,
    ): void {
        const dependencies = plugin.manifest.dependencies;

        if (!dependencies) {
            return;
        }

        const seen = new Set<string>();

        for (const dependency of dependencies) {
            if (!dependency) {
                throw new ValidationError(
                    `Plugin "${plugin.manifest.slug}" contains an invalid dependency.`,
                );
            }

            if (!dependency.type) {
                throw new ValidationError(
                    `Plugin "${plugin.manifest.slug}" contains a dependency without a type.`,
                );
            }

            if (!dependency.slug) {
                throw new ValidationError(
                    `Plugin "${plugin.manifest.slug}" contains a dependency without a slug.`,
                );
            }

            if (!dependency.version) {
                throw new ValidationError(
                    `Plugin "${plugin.manifest.slug}" contains a dependency without a version.`,
                );
            }

            ManifestValidator.validateSlug(
                dependency.slug,
                `${dependency.type} dependency`,
            );

            ManifestValidator.validateVersion(
                dependency.version,
                `${dependency.type} dependency`,
            );

            const key = `${dependency.type}:${dependency.slug}`;

            if (seen.has(key)) {
                throw new ValidationError(
                    `Plugin "${plugin.manifest.slug}" declares duplicate dependency ` +
                    `"${dependency.type}:${dependency.slug}".`,
                );
            }

            seen.add(key);
        }
    }

    private validateModules(
        plugin: PhestusPlugin,
    ): void {
        if (!plugin.modules) {
            return;
        }

        const validator = new ModuleValidator();
        const seen = new Set<string>();

        for (const module of plugin.modules) {
            validator.validate(module);

            const slug = module.manifest.slug;

            if (seen.has(slug)) {
                throw new ValidationError(
                    `Plugin "${plugin.manifest.slug}" contains duplicate ` +
                    `module "${slug}".`,
                );
            }

            seen.add(slug);
        }
    }

    private validateProviders(
        plugin: PhestusPlugin,
    ): void {
        if (!plugin.providers) {
            return;
        }

        const validator = new ProviderValidator(
            this.modules,
        );

        const seen = new Set<string>();

        for (const provider of plugin.providers) {
            /*
             * Providers contained by a plugin may reference modules
             * contained by that same plugin. Those modules aren't
             * necessarily registered yet, so validate their existence
             * against both the runtime registry and the plugin itself.
             */
            const pluginModule = plugin.modules?.find(
                module =>
                    module.manifest.slug === provider.moduleSlug,
            );

            if (!pluginModule && !this.modules.has(provider.moduleSlug)) {
                throw new ValidationError(
                    `Provider "${provider.slug}" references module ` +
                    `"${provider.moduleSlug}", but the module is not ` +
                    `registered or included in plugin "${plugin.manifest.slug}".`,
                );
            }

            const slug = provider.slug;

            if (seen.has(slug)) {
                throw new ValidationError(
                    `Plugin "${plugin.manifest.slug}" contains duplicate ` +
                    `provider "${slug}".`,
                );
            }

            seen.add(slug);

            /*
             * If the provider references a module already registered,
             * use the normal provider validator.
             *
             * If it references a module contained by this plugin, the
             * structural checks are performed here and the cross-plugin
             * registration validation happens when the plugin is registered.
             */
            if (this.modules.has(provider.moduleSlug)) {
                validator.validate(provider);
            } else {
                ManifestValidator.validateSlug(
                    provider.slug,
                    "Provider",
                );

                ManifestValidator.validateName(
                    provider.name,
                    "Provider",
                );

                ManifestValidator.validateVersion(
                    provider.version,
                    "Provider",
                );

                ManifestValidator.validateSlug(
                    provider.moduleSlug,
                    "Provider module",
                );

                this.validateProviderDependencies(provider.dependencies);
            }
        }
    }

    private validateProviderDependencies(
        dependencies: PhestusDependency[] | undefined,
    ): void {
        if (!dependencies) {
            return;
        }

        for (const dependency of dependencies) {
            if (!dependency.type) {
                throw new ValidationError(
                    "Provider dependency must define a type.",
                );
            }

            if (!dependency.slug) {
                throw new ValidationError(
                    "Provider dependency must define a slug.",
                );
            }

            if (!dependency.version) {
                throw new ValidationError(
                    "Provider dependency must define a version.",
                );
            }

            ManifestValidator.validateSlug(
                dependency.slug,
                `${dependency.type} dependency`,
            );

            ManifestValidator.validateVersion(
                dependency.version,
                `${dependency.type} dependency`,
            );
        }
    }

    private validateProvides(
        plugin: PhestusPlugin,
    ): void {
        const provides = plugin.manifest.provides;

        if (!Array.isArray(provides)) {
            throw new ValidationError(
                `Plugin "${plugin.manifest.slug}" must define a provides array.`,
            );
        }

        const modules = new Map(
            (plugin.modules ?? []).map(module => [
                module.manifest.slug,
                module,
            ]),
        );

        const providers = new Map(
            (plugin.providers ?? []).map(provider => [
                provider.slug,
                provider,
            ]),
        );

        const seen = new Set<string>();

        for (const capability of provides) {
            if (!capability) {
                throw new ValidationError(
                    `Plugin "${plugin.manifest.slug}" contains an invalid capability.`,
                );
            }

            if (!capability.moduleSlug) {
                throw new ValidationError(
                    `Plugin "${plugin.manifest.slug}" contains a capability ` +
                    `without a moduleSlug.`,
                );
            }

            if (!capability.providerSlug) {
                throw new ValidationError(
                    `Plugin "${plugin.manifest.slug}" contains a capability ` +
                    `without a providerSlug.`,
                );
            }

            ManifestValidator.validateSlug(
                capability.moduleSlug,
                "Capability module",
            );

            ManifestValidator.validateSlug(
                capability.providerSlug,
                "Capability provider",
            );

            const key =
                `${capability.moduleSlug}:${capability.providerSlug}`;

            if (seen.has(key)) {
                throw new ValidationError(
                    `Plugin "${plugin.manifest.slug}" declares duplicate ` +
                    `capability "${key}".`,
                );
            }

            seen.add(key);

            const module =
                modules.get(capability.moduleSlug) ??
                this.modules.find(capability.moduleSlug);

            if (!module) {
                throw new ValidationError(
                    `Plugin "${plugin.manifest.slug}" provides module ` +
                    `"${capability.moduleSlug}", but that module does not exist.`,
                );
            }

            const provider =
                providers.get(capability.providerSlug);

            if (!provider) {
                throw new ValidationError(
                    `Plugin "${plugin.manifest.slug}" provides provider ` +
                    `"${capability.providerSlug}", but that provider is not ` +
                    `included in the plugin.`,
                );
            }

            if (
                provider.moduleSlug !==
                capability.moduleSlug
            ) {
                throw new ValidationError(
                    `Plugin "${plugin.manifest.slug}" declares provider ` +
                    `"${provider.slug}" as an implementation of module ` +
                    `"${capability.moduleSlug}", but the provider belongs to ` +
                    `"${provider.moduleSlug}".`,
                );
            }
        }
    }
}