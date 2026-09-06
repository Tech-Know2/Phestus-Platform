import type { PhestusDependency } from "@phestus/sdk";

import {
    DependencyGraph,
} from "./dependency-graph";

import {
    DependencyError,
} from "./dependency-error";

import type {
    DependencyNode,
} from "./dependency-node";

export class DependencyResolver {
    constructor(
        private readonly graph: DependencyGraph,
    ) { }

    resolve(): DependencyNode[] {
        const resolved: DependencyNode[] = [];

        const resolving = new Set<string>();
        const resolvedKeys = new Set<string>();

        for (const node of this.graph.list()) {
            this.resolveNode(
                node,
                resolved,
                resolving,
                resolvedKeys,
            );
        }

        return resolved;
    }

    private resolveNode(
        node: DependencyNode,
        resolved: DependencyNode[],
        resolving: Set<string>,
        resolvedKeys: Set<string>,
    ): void {
        const key = this.key(node);

        if (resolvedKeys.has(key)) {
            return;
        }

        if (resolving.has(key)) {
            throw new DependencyError(
                `Circular dependency detected involving "${key}".`,
            );
        }

        resolving.add(key);

        for (const dependency of node.dependencies) {
            const dependencyNode =
                this.resolveDependency(dependency);

            if (!dependencyNode) {
                if (dependency.optional) {
                    continue;
                }

                throw new DependencyError(
                    `"${key}" requires ` +
                    `"${dependency.type}:${dependency.slug}" ` +
                    `version "${dependency.version}", ` +
                    `but it is not registered.`,
                );
            }

            this.validateVersion(
                node,
                dependency,
                dependencyNode,
            );

            this.resolveNode(
                dependencyNode,
                resolved,
                resolving,
                resolvedKeys,
            );
        }

        resolving.delete(key);
        resolvedKeys.add(key);

        resolved.push(node);
    }

    private resolveDependency(
        dependency: PhestusDependency,
    ): DependencyNode | undefined {
        return this.graph.find(
            dependency.type,
            dependency.slug,
        );
    }

    private validateVersion(
        node: DependencyNode,
        dependency: PhestusDependency,
        dependencyNode: DependencyNode,
    ): void {
        if (
            dependencyNode.version !==
            dependency.version
        ) {
            throw new DependencyError(
                `"${node.type}:${node.slug}" requires ` +
                `"${dependency.type}:${dependency.slug}" ` +
                `version "${dependency.version}", ` +
                `but version "${dependencyNode.version}" is registered.`,
            );
        }
    }

    private key(node: DependencyNode): string {
        return `${node.type}:${node.slug}`;
    }
}