import type { WorkflowDefinition } from "./types";

export class WorkflowRegistry {
    private readonly workflows = new Map<
        string,
        WorkflowDefinition
    >();

    register(
        workflow: WorkflowDefinition
    ): void {
        if (this.workflows.has(workflow.slug)) {
            throw new Error(
                `Workflow "${workflow.slug}" is already registered.`
            );
        }

        this.workflows.set(
            workflow.slug,
            workflow,
        );
    }

    unregister(
        slug: string
    ): boolean {
        return this.workflows.delete(slug);
    }

    get(
        slug: string
    ): WorkflowDefinition {
        const workflow = this.workflows.get(slug);

        if (!workflow) {
            throw new Error(
                `Workflow "${slug}" is not registered.`
            );
        }

        return workflow;
    }

    find(
        slug: string
    ): WorkflowDefinition | undefined {
        return this.workflows.get(slug);
    }

    has(
        slug: string
    ): boolean {
        return this.workflows.has(slug);
    }

    list(): WorkflowDefinition[] {
        return Array.from(
            this.workflows.values()
        );
    }

    clear(): void {
        this.workflows.clear();
    }
}