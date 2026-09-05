import type { PhestusModule } from "@phestus/sdk";
import { ModuleValidator } from "../validator/module-validator";

export class ModuleRegistry {
    private readonly modules = new Map<string, PhestusModule>();

    private readonly validator = new ModuleValidator();

    register(module: PhestusModule): void {
        this.validator.validate(module);

        const slug = module.manifest.slug;

        if (this.modules.has(slug)) {
            throw new Error(
                `Module "${slug}" is already registered.`,
            );
        }

        this.modules.set(slug, module);
    }

    get(slug: string): PhestusModule {
        const module = this.modules.get(slug);

        if (!module) {
            throw new Error(
                `Module "${slug}" is not registered.`,
            );
        }

        return module;
    }

    find(slug: string): PhestusModule | undefined {
        return this.modules.get(slug);
    }

    has(slug: string): boolean {
        return this.modules.has(slug);
    }

    list(): PhestusModule[] {
        return Array.from(this.modules.values());
    }
}