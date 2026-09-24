import {
    EventBus,
    Logger,
    PhestusContext,
    PhestusModule,
    PhestusPlugin,
    PhestusService,
} from "@phestus/sdk";
import { PluginRegistry } from "../registry/plugin-registry";
import { ProviderRegistry } from "../registry/provider-registry";
import { ModuleRegistry } from "../registry/module-registry";
import { PhestusRuntime } from "../runtime";

export interface PhestusHostConfig {
    plugins?: PhestusPlugin[];
    modules?: PhestusModule[];
    service?: PhestusService;
    logger: Logger;
    eventBus?: EventBus;
}

export class PhestusHost {
    protected readonly plugins: PluginRegistry;
    protected readonly providers: ProviderRegistry;
    protected readonly modules: ModuleRegistry;
    protected readonly runtime: PhestusRuntime;

    constructor(config: PhestusHostConfig) {
        this.modules = new ModuleRegistry();

        this.providers = new ProviderRegistry(
            this.modules,
        );

        this.plugins = new PluginRegistry(
            this.modules,
        );

        const context: PhestusContext = {
            service: config.service,
            logger: config.logger,
            eventBus: config.eventBus,
        };

        for (const module of config.modules ?? []) {
            this.modules.register(module);
        }

        for (const plugin of config.plugins ?? []) {
            this.plugins.register(plugin);

            for (const module of plugin.modules ?? []) {
                this.modules.register(module);
            }

            for (const provider of plugin.providers ?? []) {
                this.providers.register(provider);
            }
        }

        this.runtime = new PhestusRuntime(
            context,
            this.modules,
            this.providers,
            this.plugins,
        );
    }

    async initialize() {
        await this.runtime.initialize();
    }

    async shutdown() {
        await this.runtime.shutdown();
    }

    getState() {
        return this.runtime.getState();
    }

    getModule(slug: string) {
        return this.modules.get(slug);
    }

    getProvider(slug: string) {
        return this.providers.get(slug);
    }

    getPlugin(slug: string) {
        return this.plugins.get(slug);
    }
}