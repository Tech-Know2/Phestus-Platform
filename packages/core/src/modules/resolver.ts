import type { PhestusModule } from "@phestus/sdk";
import { ModuleRegistry } from "./registry";

export class ModuleResolver {
    constructor(
        private readonly registry: ModuleRegistry
    ) { }

    resolve(): PhestusModule[] {
        const resolved: PhestusModule[] = [];
        const resolving = new Set<string>();
        const resolvedSlugs = new Set<string>();

        const resolveModule = (module: PhestusModule): void => {
            const slug = module.manifest.slug;

            // Already resolved
            if (resolvedSlugs.has(slug)) {
                return;
            }

            // Circular dependency
            if (resolving.has(slug)) {
                throw new Error(
                    `Circular dependency detected involving module "${slug}".`
                );
            }

            resolving.add(slug);

            for (const dependency of module.manifest.dependencies ?? []) {
                const dependencyModule = this.registry.find(dependency.slug);

                // Dependency doesn't exist
                if (!dependencyModule) {
                    throw new Error(
                        `Module "${slug}" requires module "${dependency.slug}", but it is not registered.`
                    );
                }

                // Exact version mismatch
                if (dependencyModule.manifest.version !== dependency.version) {
                    throw new Error(
                        `Module "${slug}" requires module "${dependency.slug}" version "${dependency.version}", but version "${dependencyModule.manifest.version}" is registered.`
                    );
                }

                // Resolve dependency first
                resolveModule(dependencyModule);
            }

            resolving.delete(slug);
            resolvedSlugs.add(slug);

            resolved.push(module);
        };

        for (const module of this.registry.list()) {
            resolveModule(module);
        }

        return resolved;
    }
}