import type { PhestusDependency } from "@phestus/sdk";

import type {
    DependencyNode,
    DependencyNodeType,
} from "./dependency-node";

import { DependencyError } from "./dependency-error";

export class DependencyGraph {
    private readonly nodes = new Map<
        string,
        DependencyNode
    >();

    private getKey(
        type: DependencyNodeType,
        slug: string,
    ): string {
        return `${type}:${slug}`;
    }

    add(node: DependencyNode): void {
        const key = this.getKey(
            node.type,
            node.slug,
        );

        if (this.nodes.has(key)) {
            throw new DependencyError(
                `Dependency node "${key}" is already registered.`,
            );
        }

        this.nodes.set(key, node);
    }

    get(
        type: DependencyNodeType,
        slug: string,
    ): DependencyNode {
        const node = this.find(type, slug);

        if (!node) {
            throw new DependencyError(
                `Dependency node "${type}:${slug}" is not registered.`,
            );
        }

        return node;
    }

    find(
        type: DependencyNodeType,
        slug: string,
    ): DependencyNode | undefined {
        return this.nodes.get(
            this.getKey(type, slug),
        );
    }

    has(
        type: DependencyNodeType,
        slug: string,
    ): boolean {
        return this.nodes.has(
            this.getKey(type, slug),
        );
    }

    list(): DependencyNode[] {
        return Array.from(this.nodes.values());
    }

    dependencies(
        node: DependencyNode,
    ): PhestusDependency[] {
        return node.dependencies;
    }

    clear(): void {
        this.nodes.clear();
    }
}