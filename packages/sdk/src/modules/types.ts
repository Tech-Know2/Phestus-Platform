import { Payload } from "payload";
import { Logger } from "../logger";
import { EventBus } from "../event";

export interface PhestusModule {
    manifest: ModuleManifest;

    initialize?(context: ModuleContext): Promise<void>;
    shutdown?(context: ModuleContext): Promise<void>;
}

export interface ModuleManifest {
    slug: string;
    name: string;
    version: string;

    dependencies?: ModuleDependency[];
}

export interface ModuleDependency {
    slug: string;
    version: string;
}

export interface ModuleContext {
    payload?: Payload;
    logger: Logger;
    eventBus: EventBus;
}