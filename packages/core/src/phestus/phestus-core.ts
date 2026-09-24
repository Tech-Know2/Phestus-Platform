import type {
    Logger,
    PhestusModule,
    PhestusPlugin,
    EventBus,
    PhestusService,
} from "@phestus/sdk";
import { PhestusHost } from "./phestus-host";


export interface PhestusConfig {
    plugins?: PhestusPlugin[];
    modules?: PhestusModule[];
    service: PhestusService;
    logger: Logger;
    eventBus: EventBus;
}

export class Phestus extends PhestusHost {
    constructor(config: PhestusConfig) {
        super(config);
    }
}