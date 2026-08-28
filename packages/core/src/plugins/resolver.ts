import { PhestusPlugin } from "@phestus/sdk";
import { PluginRegistry } from "./registry";

export class PluginResolver {
    constructor(
        private readonly registry: PluginRegistry
    ) { }

    resolve(): PhestusPlugin[] {
        const resolved: PhestusPlugin[] = []
        const resolving = new Set<string>()
        const resolvedSlugs = new Set<string>()

        const resolvePlugin = (plugin: PhestusPlugin): void => {
            const slug = plugin.manifest.slug

            // Already Resolved
            if (resolvedSlugs.has(slug)) {
                return
            }

            // Circular Dependency
            if (resolving.has(slug)) {
                throw new Error(
                    `Circular dependency detected involving plugin "${slug}".`
                )
            }

            resolving.add(slug)

            for (const dependency of plugin.manifest.dependencies ?? []) {
                const dependencyPlugin = this.registry.find(dependency.slug);

                // Dependency doesn't exist
                if (!dependencyPlugin) {
                    throw new Error(
                        `Plugin "${slug}" requires plugin "${dependency.slug}", but it is not registered.`
                    );
                }

                // Exact version mismatch
                if (dependencyPlugin.manifest.version !== dependency.version) {
                    throw new Error(
                        `Plugin "${slug}" requires plugin "${dependency.slug}" version "${dependency.version}", but version "${dependencyPlugin.manifest.version}" is registered.`
                    );
                }

                // Resolve dependency first
                resolvePlugin(dependencyPlugin);
            }

            resolving.delete(slug);
            resolvedSlugs.add(slug);

            resolved.push(plugin);
        };

        for (const plugin of this.registry.list()) {
            resolvePlugin(plugin);
        }

        return resolved;
    }
}