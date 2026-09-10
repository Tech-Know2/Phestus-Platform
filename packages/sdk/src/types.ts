import { Logger } from "./logger";
import { EventBus } from "./event";
import { PhestusService } from "./service";

export interface PhestusContext {
    service: PhestusService;
    logger: Logger;
    eventBus: EventBus;
}

export interface PhestusDependency {
    type: "plugin" | "module" | "provider";
    slug: string;
    version: string;
    optional?: boolean;
}