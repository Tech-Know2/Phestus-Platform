import { JobModule } from "@phestus/job-module";
import type { Logger, PhestusEvent } from "@phestus/sdk";

export interface WorkflowContext<
    TInput = unknown
> {
    input: TInput;
    event?: PhestusEvent;
    executionId: string;
    workflowId: string;
    metadata: Record<string, unknown>;
}

export interface WorkflowStepDefinition<
    TConfig = Record<string, unknown>,
    TContext extends WorkflowStepContext = WorkflowStepContext
> {
    type: string;
    name: string;
    description?: string;

    execute(
        context: TContext,
        config: TConfig,
    ): Promise<TContext | void>;
}

export interface WorkflowStepContext<
    TInput = unknown
> extends WorkflowContext<TInput> {
    job: JobModule;
    logger: Logger;
    // Payload will need to be passed through here
}

export interface WorkflowStep {
    id: string;
    type: string;
    config?: Record<string, unknown>;
}

export interface WorkflowDefinition<
    TInput = unknown
> {
    slug: string;
    name: string;
    version: string;
    steps: WorkflowStep[];
    triggers?: WorkflowTrigger[];
}

export interface WorkflowTrigger {
    event: string;
}

export interface WorkflowExecutionResult<
    TContext = WorkflowContext
> {
    executionId: string;
    workflowId: string;

    status:
    | "completed"
    | "failed";

    context?: TContext;
    error?: unknown;
}