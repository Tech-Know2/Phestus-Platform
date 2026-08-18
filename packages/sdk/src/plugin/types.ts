export interface PhestusPlugin {
    manifest: PluginManifest;

    initialize?(context: PluginContext): Promise<void>;
    shutdown?(context: PluginContext): Promise<void>;
}

export interface PluginManifest {
    slug: string;
    name: string;
    version: string;

    dependencies?: PluginDependency[];
}

export interface PluginDependency {
    slug: string;
    version: string;
}

// Minimum version, I will add more context and features as I go along
export interface PluginContext {
    //payload: Payload;
    //logger: Logger;
}