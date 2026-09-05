import { Logger } from "./logger";
import { EventBus } from "./event";

export interface PhestusContext {
    service?: unknown;
    logger: Logger;
    eventBus: EventBus;
}

export interface PhestusDependency {
    type: "plugin" | "module" | "provider";
    slug: string;
    version: string;
    optional?: boolean;
}