import type { PhestusProvider } from "@phestus/sdk";

export class ProviderRegistry {
    private providers = new Map<string, PhestusProvider>();

    register(provider: PhestusProvider): void {
        if (this.providers.has(provider.slug)) {
            throw new Error(
                `Provider "${provider.slug}" is already registered.`
            );
        }

        this.providers.set(provider.slug, provider);
    }

    get(slug: string): PhestusProvider {
        const provider = this.providers.get(slug);

        if (!provider) {
            throw new Error(
                `Provider "${slug}" is not registered.`
            );
        }

        return provider;
    }

    find(slug: string): PhestusProvider | undefined {
        return this.providers.get(slug);
    }

    has(slug: string): boolean {
        return this.providers.has(slug);
    }

    list(): PhestusProvider[] {
        return Array.from(this.providers.values());
    }

    findByModule(moduleSlug: string): PhestusProvider[] {
        return this.list().filter(
            provider => provider.module === moduleSlug
        );
    }
}