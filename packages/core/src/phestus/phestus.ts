import type {
    Logger,
    PhestusModule,
    PhestusPlugin,
    PhestusContext,
    EventBus,
} from "@phestus/sdk";

import type { Payload } from "payload"
import { PluginRegistry } from "../plugins/registry";
import { PluginResolver } from "../plugins/resolver";
import { ProviderRegistry } from "../providers/registry";
import { ModuleRegistry } from "../modules/registry";
import { ModuleResolver } from "../modules/resolver";

export interface PhestusConfig {
    plugins?: PhestusPlugin[]
    modules?: PhestusModule[]
    payload?: Payload
    logger: Logger
    eventBus: EventBus
}

export class Phestus {
    private readonly plugins: PluginRegistry
    private readonly providers: ProviderRegistry
    private readonly modules: ModuleRegistry

    private readonly pluginResolver: PluginResolver
    private readonly moduleResolver: ModuleResolver

    private readonly context: PhestusContext

    constructor(config: PhestusConfig) {
        this.plugins = new PluginRegistry()
        this.providers = new ProviderRegistry()
        this.modules = new ModuleRegistry()

        this.pluginResolver = new PluginResolver(this.plugins)
        this.moduleResolver = new ModuleResolver(this.modules)

        this.context = {
            payload: config.payload,
            logger: config.logger,
            eventBus: config.eventBus
        };

        this.context = {
            payload: config.payload,
            logger: config.logger,
            eventBus: config.eventBus
        }

        for (const module of config.modules ?? []) {
            this.modules.register(module);
        }

        for (const plugin of config.plugins ?? []) {
            this.plugins.register(plugin);

            for (const provider of plugin.providers ?? []) {
                this.providers.register(provider)
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