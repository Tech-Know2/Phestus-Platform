import type {
    PhestusProvider,
    PhestusDependency,
} from "@phestus/sdk";

import { ManifestValidator } from "./manifest-validator";
import { ValidationError } from "../errors/validator-error";
import { ModuleRegistry } from "../registry/module-registry";

export class ProviderValidator {
    constructor(
        private readonly modules: ModuleRegistry,
    ) { }

    validate(provider: PhestusProvider): void {
        if (!provider) {
            throw new ValidationError(
                "Provider cannot be undefined or null.",
            );
        }

        if (!provider.slug) {
            throw new ValidationError(
                "Provider must define a slug.",
            );
        }

        if (!provider.name) {
            throw new ValidationError(
                `Provider "${provider.slug}" must define a name.`,
            );
        }

        if (!provider.version) {
            throw new ValidationError(
                `Provider "${provider.slug}" must define a version.`,
            );
        }

        if (!provider.moduleSlug) {
            throw new ValidationError(
                `Provider "${provider.slug}" must define a moduleSlug.`,
            );
        }

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

        this.validateModule(provider);
        this.validateDependencies(provider);
    }

    private validateModule(
        provider: PhestusProvider,
    ): void {
        const module = this.modules.find(
            provider.moduleSlug,
        );

        if (!module) {
            throw new ValidationError(
                `Provider "${provider.slug}" references module ` +
                `"${provider.moduleSlug}", but that module is not registered.`,
            );
        }
    }

    private validateDependencies(
        provider: PhestusProvider,
    ): void {
        const dependencies = provider.dependencies;

        if (!dependencies) {
            return;
        }

        const seen = new Set<string>();

        for (const dependency of dependencies) {
            if (!dependency) {
                throw new ValidationError(
                    `Provider "${provider.slug}" contains an invalid dependency.`,
                );
            }

            if (!dependency.type) {
                throw new ValidationError(
                    `Provider "${provider.slug}" contains a dependency without a type.`,
                );
            }

            if (!dependency.slug) {
                throw new ValidationError(
                    `Provider "${provider.slug}" contains a dependency without a slug.`,
                );
            }

            if (!dependency.version) {
                throw new ValidationError(
                    `Provider "${provider.slug}" contains a dependency without a version.`,
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
                    `Provider "${provider.slug}" declares duplicate dependency ` +
                    `"${dependency.type}:${dependency.slug}".`,
                );
            }

            seen.add(key);
        }
    }
}