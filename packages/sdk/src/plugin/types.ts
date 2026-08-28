import { Logger } from "../logger";
import type { Payload } from "payload"
import { PhestusProvider } from "../provider";
import { EventBus } from "../event";
import { PhestusContext } from "../types";

export interface PhestusPlugin {
    manifest: PluginManifest;

    providers?: PhestusProvider[];

    initialize?(context: PhestusContext): Promise<void>;
    shutdown?(context: PhestusContext): Promise<void>;
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

export interface PluginCapability {
    module: string;
    provider: string;
}