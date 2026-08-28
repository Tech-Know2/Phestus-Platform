import type { PhestusModule } from "@phestus/sdk"

export class ModuleRegistry {
    private modules = new Map<string, PhestusModule>();

    register(module: PhestusModule): void {
        if (this.modules.has(module.manifest.slug)) {
            throw new Error(`Module "${module.manifest.slug}" is already registered.`);
        }

        this.modules.set(module.manifest.slug, module);
    }

    get(slug: string): PhestusModule {
        const module = this.modules.get(slug)

        if (!module) {
            throw new Error(`Module "${slug}" is not registered.`)
        }

        return module
    }

    find(slug: string): PhestusModule | undefined {
        return this.modules.get(slug)
    }

    has(slug: string): boolean {
        return this.modules.has(slug)
    }

    list(): PhestusModule[] {
        return Array.from(this.modules.values())
    }
}