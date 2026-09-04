import type {
    WorkflowStepDefinition,
} from "./types";

export class WorkflowStepRegistry {
    private readonly steps = new Map<
        string,
        WorkflowStepDefinition
    >();

    register(
        step: WorkflowStepDefinition
    ): void {
        if (this.steps.has(step.type)) {
            throw new Error(
                `Workflow step "${step.type}" is already registered.`
            );
        }

        this.steps.set(
            step.type,
            step,
        );
    }

    get(
        type: string
    ): WorkflowStepDefinition {
        const step =
            this.steps.get(type);

        if (!step) {
            throw new Error(
                `Workflow step "${type}" is not registered.`
            );
        }

        return step;
    }

    find(
        type: string
    ): WorkflowStepDefinition | undefined {
        return this.steps.get(type);
    }

    has(
        type: string
    ): boolean {
        return this.steps.has(type);
    }

    list(): WorkflowStepDefinition[] {
        return Array.from(
            this.steps.values()
        );
    }

    unregister(
        type: string
    ): boolean {
        return this.steps.delete(type);
    }

    clear(): void {
        this.steps.clear();
    }
}