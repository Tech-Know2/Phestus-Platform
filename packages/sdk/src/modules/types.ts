import { PhestusContext, PhestusDependency } from "../types";

export interface PhestusModule {
    manifest: ModuleManifest;

    initialize?(context: PhestusContext): Promise<void>;
    shutdown?(context: PhestusContext): Promise<void>;
}

export interface ModuleManifest {
    slug: string;
    name: string;
    version: string;

    dependencies?: PhestusDependency[];

    provider?: {
        required?: boolean;
        multiple?: boolean;
    }
}