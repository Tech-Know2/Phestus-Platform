import { Payload } from "payload";
import { Logger } from "../logger";
import { EventBus } from "../event";
import { PhestusContext } from "../types";

export interface PhestusModule {
    manifest: ModuleManifest;

    initialize?(context: PhestusContext): Promise<void>;
    shutdown?(context: PhestusContext): Promise<void>;
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