import type { PhestusPlugin } from "@phestus/sdk";
import { PluginValidator } from "../validator/plugin-validator";
import { ModuleRegistry } from "./module-registry";

export class PluginRegistry {
    private readonly plugins = new Map<string, PhestusPlugin>();

    private readonly validator: PluginValidator;

    constructor(
        private readonly modules: ModuleRegistry,
    ) {
        this.validator = new PluginValidator(modules);
    }

    register(plugin: PhestusPlugin): void {
        this.validator.validate(plugin);

        const slug = plugin.manifest.slug;

        if (this.plugins.has(slug)) {
            throw new Error(
                `Plugin "${slug}" is already registered.`,
            );
        }

        this.plugins.set(slug, plugin);
    }

    get(slug: string): PhestusPlugin {
        const plugin = this.plugins.get(slug);

        if (!plugin) {
            throw new Error(
                `Plugin "${slug}" is not registered.`,
            );
        }

        return plugin;
    }

    find(slug: string): PhestusPlugin | undefined {
        return this.plugins.get(slug);
    }

    has(slug: string): boolean {
        return this.plugins.has(slug);
    }

    list(): PhestusPlugin[] {
        return Array.from(this.plugins.values());
    }
}