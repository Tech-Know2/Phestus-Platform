import { ValidationError } from "../errors/validator-error";

export class ManifestValidator {
    static validateSlug(
        slug: string,
        type: string,
    ): void {
        if (!slug || typeof slug !== "string") {
            throw new ValidationError(
                `${type} slug must be a non-empty string.`,
            );
        }

        if (!/^[a-z0-9]+(?:[-_.][a-z0-9]+)*$/.test(slug)) {
            throw new ValidationError(
                `${type} slug "${slug}" is invalid. ` +
                `Slugs may contain lowercase letters, numbers, "-", "_" and ".".`,
            );
        }
    }

    static validateName(
        name: string,
        type: string,
    ): void {
        if (!name || typeof name !== "string") {
            throw new ValidationError(
                `${type} name must be a non-empty string.`,
            );
        }
    }

    static validateVersion(
        version: string,
        type: string,
    ): void {
        if (!version || typeof version !== "string") {
            throw new ValidationError(
                `${type} version must be a non-empty string.`,
            );
        }

        // Basic SemVer validation.
        // Full range validation can be added when semver
        // dependency resolution is implemented.
        const semverRegex =
            /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

        if (!semverRegex.test(version)) {
            throw new ValidationError(
                `${type} version "${version}" is not valid SemVer.`,
            );
        }
    }
}