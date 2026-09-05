import type { PhestusDependency } from "@phestus/sdk";

export interface DependencyNode {
    slug: string;
    version: string;
}

export interface DependencyResolverOptions<T> {
    getSlug(node: T): string;
    getVersion(node: T): string;
    getDependencies(node: T): PhestusDependency[];

    get(slug: string): T | undefined;
}

export class DependencyResolver<T> {
    constructor(
        private readonly options: DependencyResolverOptions<T>,
    ) { }

    resolve(nodes: T[]): T[] {
        const resolved: T[] = [];
        const resolvedSlugs = new Set<string>();
        const resolving = new Set<string>();

        const visit = (node: T): void => {
            const slug = this.options.getSlug(node);

            if (resolvedSlugs.has(slug)) {
                return;
            }

            if (resolving.has(slug)) {
                throw new Error(
                    `Circular dependency detected involving "${slug}".`,
                );
            }

            resolving.add(slug);

            for (const dependency of this.options.getDependencies(node)) {
                const dependencyNode = this.options.get(dependency.slug);

                if (!dependencyNode) {
                    if (dependency.optional) {
                        continue;
                    }

                    throw new Error(
                        `"${slug}" requires ${dependency.type} ` +
                        `"${dependency.slug}", but it is not registered.`,
                    );
                }

                const actualVersion =
                    this.options.getVersion(dependencyNode);

                if (actualVersion !== dependency.version) {
                    throw new Error(
                        `"${slug}" requires ${dependency.type} ` +
                        `"${dependency.slug}" version "${dependency.version}", ` +
                        `but version "${actualVersion}" is registered.`,
                    );
                }

                visit(dependencyNode);
            }

            resolving.delete(slug);
            resolvedSlugs.add(slug);
            resolved.push(node);
        };

        for (const node of nodes) {
            visit(node);
        }

        return resolved;
    }
}