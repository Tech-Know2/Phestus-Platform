import type { PhestusModule, PhestusProvider } from "@phestus/sdk";

import { ModuleRegistry } from "../registry/module-registry";
import { ProviderRegistry } from "../registry/provider-registry";

export class ProviderResolver {
    constructor(
        private readonly modules: ModuleRegistry,
        private readonly providers: ProviderRegistry,
    ) { }

    resolve(moduleSlug: string): PhestusProvider[] {
        const module = this.modules.find(moduleSlug);

        if (!module) {
            throw new Error(
                `Cannot resolve providers: module "${moduleSlug}" is not registered.`,
            );
        }

        const available = this.providers.findByModule(moduleSlug);

        const config = module.manifest.provider;

        if (!config?.required) {
            return available;
        }

        if (available.length === 0) {
            throw new Error(
                `Module "${moduleSlug}" requires a provider, but no provider is registered.`,
            );
        }

        if (config.multiple) {
            return available;
        }

        if (available.length > 1) {
            throw new Error(
                `Module "${moduleSlug}" does not support multiple providers, ` +
                `but ${available.length} providers are registered.`,
            );
        }

        return available;
    }
}