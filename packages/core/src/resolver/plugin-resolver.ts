import { PhestusPlugin } from "@phestus/sdk";
import { PluginRegistry } from "../registry/plugin-registry";
import { DependencyResolver } from "./dependency-resolver";

export class PluginResolver {
    private readonly resolver: DependencyResolver<PhestusPlugin>;

    constructor(
        private readonly registry: PluginRegistry,
    ) {
        this.resolver = new DependencyResolver({
            get: (slug) => this.registry.find(slug),
            getSlug: (plugin) => plugin.manifest.slug,
            getVersion: (plugin) => plugin.manifest.version,
            getDependencies: (plugin) =>
                plugin.manifest.dependencies ?? [],
        });
    }

    resolve(): PhestusPlugin[] {
        return this.resolver.resolve(this.registry.list());
    }
}