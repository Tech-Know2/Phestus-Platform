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
import { PluginResolver } from "../resolver/plugin-resolver";
import { ModuleResolver } from "../resolver/module-resolver";

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

    private readonly pluginResolver: PluginResolver;
    private readonly moduleResolver: ModuleResolver;

    private readonly context: PhestusContext;

    constructor(config: PhestusConfig) {
        this.modules = new ModuleRegistry();

        this.providers = new ProviderRegistry(
            this.modules,
        );

        this.plugins = new PluginRegistry(
            this.modules,
        );

        this.pluginResolver = new PluginResolver(
            this.plugins,
        );

        this.moduleResolver = new ModuleResolver(
            this.modules,
        );

        this.context = {
            service: config.service,
            logger: config.logger,
            eventBus: config.eventBus,
        };

        /*
         * Register standalone modules first.
         */
        for (const module of config.modules ?? []) {
            this.modules.register(module);
        }

        /*
         * Register plugins.
         *
         * The plugin itself is validated first.
         */
        for (const plugin of config.plugins ?? []) {
            this.plugins.register(plugin);

            /*
             * Register modules provided by the plugin.
             */
            for (const module of plugin.modules ?? []) {
                this.modules.register(module);
            }

            /*
             * Register providers provided by the plugin.
             */
            for (const provider of plugin.providers ?? []) {
                this.providers.register(provider);
            }
        }
    }

    async initialize(): Promise<void> {
        const plugins = this.pluginResolver.resolve();
        const modules = this.moduleResolver.resolve();

        for (const module of modules) {
            await module.initialize?.(this.context);
        }

        for (const plugin of plugins) {
            await plugin.initialize?.(this.context);
        }
    }

    async shutdown(): Promise<void> {
        const plugins = this.pluginResolver.resolve();
        const modules = this.moduleResolver.resolve();

        for (let i = plugins.length - 1; i >= 0; i--) {
            await plugins[i].shutdown?.(this.context);
        }

        for (let i = modules.length - 1; i >= 0; i--) {
            await modules[i].shutdown?.(this.context);
        }
    }
}