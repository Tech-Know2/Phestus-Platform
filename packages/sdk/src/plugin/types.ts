import { Logger } from "../logger";
import type { Payload } from "payload"
import { PhestusProvider } from "../provider";
import { EventBus } from "../event";

export interface PhestusPlugin {
    manifest: PluginManifest;

    providers?: PhestusProvider[];

    initialize?(context: PluginContext): Promise<void>;
    shutdown?(context: PluginContext): Promise<void>;
}

export interface PluginManifest {
    slug: string;
    name: string;
    version: string;

    provides: PluginCapability[];

    dependencies?: PluginDependency[];
}

export interface PluginDependency {
    slug: string;
    version: string;
}

// Minimum version, I will add more context and features as I go along
export interface PluginContext {
    payload?: Payload;
    logger: Logger;
    eventBus: EventBus;
}

export interface PluginCapability {
    module: string;
    provider: string;
}