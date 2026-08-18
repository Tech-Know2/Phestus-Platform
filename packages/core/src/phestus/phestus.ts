import { PhestusPlugin, PluginContext } from "@phestus/sdk";
import { PluginRegistry } from "../plugins";

export interface PhestusConfig {
    plugins?: PhestusPlugin[]
    payload: Payload
    logger: Logger
}

export class Phestus {
    private readonly plugins: PluginRegistry
    private readonly context: PluginContext

    constructor(config: PhestusConfig) {
        this.plugins = new PluginRegistry()
        this.context = {
            payload: config.payload,
            logger: config.logger
        }

        for (const plugin of config.plugins ?? []) {
            this.plugins.register(plugin)
        }
    }

    async initialize(): Promise<void> {
        for (const plugin of this.plugins.list()) {
            await plugin.initialize?.(this.context)
        }
    }

    async shutdown(): Promise<void> {
        const data = this.plugins.list()

        for (let i = data.length - 1; i >= 0; i--) {
            await data[i].shutdown?.(this.context)
        }
    }
}