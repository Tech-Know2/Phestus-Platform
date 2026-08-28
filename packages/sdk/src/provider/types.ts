import { PhestusContext } from "../types";

export interface PhestusProvider {
    slug: string;
    name: string;
    module: string;

    initialize?(context: PhestusContext): Promise<void>;
    shutdown?(context: PhestusContext): Promise<void>;
}