import type {
    Logger,
    PhestusModule,
    PhestusPlugin,
    PhestusContext,
    EventBus,
} from "@phestus/sdk";
import { PluginRegistry } from "../registry/plugin-registry";
import { ProviderRegistry } from "../registry/provider-registry";
import { ModuleRegistry } from "../registry/module-registry";
import { PhestusRuntime } from "../runtime";


export interface PhestusConfig {
    plugins?: PhestusPlugin[];
    modules?: PhestusModule[];
    service?: unknown;
    logger: Logger;
    eventBus: EventBus;
}

export class Phestus {
    private readonly plugins: PluginRegistry;
    private readonly providers: ProviderRegistry;
    private readonly modules: ModuleRegistry;
    private readonly runtime: PhestusRuntime;

    constructor(
        config: PhestusConfig,
    ) {
        this.modules =
            new ModuleRegistry();

        this.providers =
            new ProviderRegistry(
                this.modules,
            );

        this.plugins =
            new PluginRegistry(
                this.modules,
            );

        const context: PhestusContext = {
            service: config.service,
            logger: config.logger,
            eventBus: config.eventBus,
        };

        /*
         * Register standalone modules.
         */
        for (
            const module of
            config.modules ?? []
        ) {
            this.modules.register(
                module,
            );
        }

        /*
         * Register plugins.
         */
        for (
            const plugin of
            config.plugins ?? []
        ) {
            this.plugins.register(
                plugin,
            );

            /*
             * Register modules supplied
             * by the plugin.
             */
            for (
                const module of
                plugin.modules ?? []
            ) {
                this.modules.register(
                    module,
                );
            }

            /*
             * Register providers supplied
             * by the plugin.
             */
            for (
                const provider of
                plugin.providers ?? []
            ) {
                this.providers.register(
                    provider,
                );
            }
        }

        this.runtime =
            new PhestusRuntime(
                context,
                this.modules,
                this.providers,
                this.plugins,
            );
    }

    async initialize(): Promise<void> {
        await this.runtime.initialize();
    }

    async shutdown(): Promise<void> {
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