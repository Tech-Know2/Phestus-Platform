import type {
    PhestusModule,
    PhestusDependency,
} from "@phestus/sdk";

import { ManifestValidator } from "./manifest-validator";
import { ValidationError } from "../errors/validator-error";

export class ModuleValidator {
    validate(module: PhestusModule): void {
        if (!module) {
            throw new ValidationError(
                "Module cannot be undefined or null.",
            );
        }

        if (!module.manifest) {
            throw new ValidationError(
                "Module must define a manifest.",
            );
        }

        const manifest = module.manifest;

        ManifestValidator.validateSlug(
            manifest.slug,
            "Module",
        );

        ManifestValidator.validateName(
            manifest.name,
            "Module",
        );

        ManifestValidator.validateVersion(
            manifest.version,
            "Module",
        );

        this.validateDependencies(
            manifest.dependencies,
            manifest.slug,
        );

        this.validateProviderConfiguration(module);
    }

    private validateDependencies(
        dependencies: PhestusDependency[] | undefined,
        moduleSlug: string,
    ): void {
        if (!dependencies) {
            return;
        }

        const seen = new Set<string>();

        for (const dependency of dependencies) {
            if (!dependency) {
                throw new ValidationError(
                    `Module "${moduleSlug}" contains an invalid dependency.`,
                );
            }

            if (!dependency.type) {
                throw new ValidationError(
                    `Module "${moduleSlug}" contains a dependency without a type.`,
                );
            }

            if (!dependency.slug) {
                throw new ValidationError(
                    `Module "${moduleSlug}" contains a dependency without a slug.`,
                );
            }

            if (!dependency.version) {
                throw new ValidationError(
                    `Module "${moduleSlug}" contains a dependency without a version.`,
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
                    `Module "${moduleSlug}" declares duplicate dependency ` +
                    `"${dependency.type}:${dependency.slug}".`,
                );
            }

            seen.add(key);
        }
    }

    private validateProviderConfiguration(
        module: PhestusModule,
    ): void {
        const provider = module.manifest.provider;

        if (!provider) {
            return;
        }

        if (
            provider.required !== undefined &&
            typeof provider.required !== "boolean"
        ) {
            throw new ValidationError(
                `Module "${module.manifest.slug}" provider.required ` +
                `must be a boolean.`,
            );
        }

        if (
            provider.multiple !== undefined &&
            typeof provider.multiple !== "boolean"
        ) {
            throw new ValidationError(
                `Module "${module.manifest.slug}" provider.multiple ` +
                `must be a boolean.`,
            );
        }
    }
}