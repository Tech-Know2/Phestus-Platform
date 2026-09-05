import type { PhestusModule } from "@phestus/sdk";
import { ModuleRegistry } from "../registry/module-registry";
import { DependencyResolver } from "./dependency-resolver";

export class ModuleResolver {
    private readonly resolver: DependencyResolver<PhestusModule>;

    constructor(
        private readonly registry: ModuleRegistry,
    ) {
        this.resolver = new DependencyResolver({
            get: (slug) => this.registry.find(slug),
            getSlug: (module) => module.manifest.slug,
            getVersion: (module) => module.manifest.version,
            getDependencies: (module) =>
                module.manifest.dependencies ?? [],
        });
    }

    resolve(): PhestusModule[] {
        return this.resolver.resolve(this.registry.list());
    }
}