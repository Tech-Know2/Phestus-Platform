import type {
    PhestusContext,
} from "@phestus/sdk";
import { DependencyNode } from "../depencencies/dependency-node";


export class RuntimeLifecycle {
    constructor(
        private readonly context: PhestusContext,
    ) { }

    async initialize(
        nodes: DependencyNode[],
    ): Promise<void> {
        for (const node of nodes) {
            await node.value.initialize?.(
                this.context,
            );
        }
    }

    async shutdown(
        nodes: DependencyNode[],
    ): Promise<void> {
        for (let i = nodes.length - 1; i >= 0; i--) {
            await nodes[i].value.shutdown?.(
                this.context,
            );
        }
    }
}