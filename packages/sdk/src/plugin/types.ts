import { PhestusProvider } from "../provider";
import { PhestusContext, PhestusDependency } from "../types";
import { PhestusModule } from "../modules";

export interface PhestusPlugin {
    manifest: PluginManifest;

    modules?: PhestusModule[];
    providers?: PhestusProvider[];

    initialize?(context: PhestusContext): Promise<void>;
    shutdown?(context: PhestusContext): Promise<void>;
}

export interface PluginManifest {
    slug: string;
    name: string;
    version: string;

    provides: PluginCapability[];

    dependencies?: PhestusDependency[];
}

export interface PluginCapability {
    moduleSlug: string;
    providerSlug: string;
}