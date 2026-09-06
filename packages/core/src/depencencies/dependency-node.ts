import type {
    PhestusDependency,
    PhestusModule,
    PhestusPlugin,
    PhestusProvider,
} from "@phestus/sdk";

export type DependencyNodeType =
    | "plugin"
    | "module"
    | "provider";

export type DependencyNodeValue =
    | PhestusPlugin
    | PhestusModule
    | PhestusProvider;

export interface DependencyNode {
    type: DependencyNodeType;
    slug: string;
    version: string;

    value: DependencyNodeValue;

    dependencies: PhestusDependency[];
}