import { PhestusContext, PhestusDependency } from "../types";

export interface PhestusProvider {
    slug: string;
    name: string;
    version: string;
    moduleSlug: string;

    dependencies?: PhestusDependency[];

    initialize?(context: PhestusContext): Promise<void>;
    shutdown?(context: PhestusContext): Promise<void>;
}