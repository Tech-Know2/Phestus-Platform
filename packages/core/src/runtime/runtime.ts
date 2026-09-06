import type {
    PhestusContext,
} from "@phestus/sdk";

import {
    RuntimeLifecycle,
} from "./runtime-lifecycle";

import type {
    RuntimeState,
} from "./runtime-state";
import { DependencyResolver } from "../depencencies/dependency-resolver";
import { ModuleRegistry } from "../registry/module-registry";
import { ProviderRegistry } from "../registry/provider-registry";
import { PluginRegistry } from "../registry/plugin-registry";
import { DependencyGraph } from "../depencencies/dependency-graph";

export class PhestusRuntime {
    private state: RuntimeState = "created";

    private resolvedNodes: ReturnType<
        DependencyResolver["resolve"]
    > = [];

    private readonly lifecycle: RuntimeLifecycle;

    constructor(
        private readonly context: PhestusContext,
        private readonly modules: ModuleRegistry,
        private readonly providers: ProviderRegistry,
        private readonly plugins: PluginRegistry,
    ) {
        this.lifecycle = new RuntimeLifecycle(
            context,
        );
    }

    getState(): RuntimeState {
        return this.state;
    }

    async initialize(): Promise<void> {
        if (this.state === "initialized") {
            return;
        }

        if (this.state !== "created") {
            throw new Error(
                `Runtime cannot initialize from state "${this.state}".`,
            );
        }

        this.state = "initializing";

        try {
            const graph =
                this.buildDependencyGraph();

            const resolver =
                new DependencyResolver(graph);

            this.resolvedNodes =
                resolver.resolve();

            await this.lifecycle.initialize(
                this.resolvedNodes,
            );

            this.state = "initialized";
        } catch (error) {
            this.state = "failed";

            throw error;
        }
    }

    async shutdown(): Promise<void> {
        if (this.state === "shutdown") {
            return;
        }

        if (this.state !== "initialized") {
            throw new Error(
                `Runtime cannot shutdown from state "${this.state}".`,
            );
        }

        this.state = "shutting-down";

        try {
            await this.lifecycle.shutdown(
                this.resolvedNodes,
            );

            this.state = "shutdown";
        } catch (error) {
            this.state = "failed";

            throw error;
        }
    }

    private buildDependencyGraph(): DependencyGraph {
        const graph = new DependencyGraph();

        /*
         * Modules
         */
        for (const module of this.modules.list()) {
            graph.add({
                type: "module",
                slug: module.manifest.slug,
                version: module.manifest.version,
                value: module,
                dependencies:
                    module.manifest.dependencies ?? [],
            });
        }

        /*
         * Providers
         */
        for (const provider of this.providers.list()) {
            graph.add({
                type: "provider",
                slug: provider.slug,
                version: provider.version,
                value: provider,
                dependencies:
                    provider.dependencies ?? [],
            });
        }

        /*
         * Plugins
         */
        for (const plugin of this.plugins.list()) {
            graph.add({
                type: "plugin",
                slug: plugin.manifest.slug,
                version: plugin.manifest.version,
                value: plugin,
                dependencies:
                    plugin.manifest.dependencies ?? [],
            });
        }

        return graph;
    }
}