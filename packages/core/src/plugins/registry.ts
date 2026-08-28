import type { PhestusPlugin } from '@phestus/sdk'

export class PluginRegistry {
    private plugins = new Map<string, PhestusPlugin>();

    register(plugin: PhestusPlugin): void {
        if (this.plugins.has(plugin.manifest.slug)) {
            throw new Error(`Plugin "${plugin.manifest.slug}" is already registered.`);
        }

        this.plugins.set(plugin.manifest.slug, plugin);
    }

    get(slug: string): PhestusPlugin {
        const plugin = this.plugins.get(slug)

        if (!plugin) {
            throw new Error(`Plugin "${slug}" is not registered.`)
        }

        return plugin
    }

    find(slug: string): PhestusPlugin | undefined {
        return this.plugins.get(slug)
    }

    has(slug: string): boolean {
        return this.plugins.has(slug)
    }

    list(): PhestusPlugin[] {
        return Array.from(this.plugins.values());
    }
}