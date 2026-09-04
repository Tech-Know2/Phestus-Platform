import type {
    PhestusEvent,
    Logger,
} from "@phestus/sdk";

import { JobModule } from "@phestus/job-module";

import type {
    WorkflowStepContext,
    WorkflowExecutionResult,
} from "./types";

import { WorkflowRegistry } from "./workflow-registry";
import { WorkflowStepRegistry } from "./workflow-step-registry";

export class WorkflowEngine {
    constructor(
        private readonly workflowRegistry: WorkflowRegistry,
        private readonly stepRegistry: WorkflowStepRegistry,
        private readonly job: JobModule,
        private readonly logger: Logger,
    ) { }

    async execute<TInput = unknown>(
        workflowId: string,
        input: TInput,
        event?: PhestusEvent,
    ): Promise<WorkflowExecutionResult> {
        const workflow =
            this.workflowRegistry.get(
                workflowId
            );

        const executionId =
            crypto.randomUUID();

        let context: WorkflowStepContext = {
            input,
            event,
            executionId,
            workflowId,
            metadata: {},
            job: this.job,
            logger: this.logger,
        };

        try {
            for (const step of workflow.steps) {
                const definition =
                    this.stepRegistry.get(
                        step.type
                    );

                const result =
                    await definition.execute(
                        context,
                        step.config ?? {},
                    );

                if (result) {
                    context = result;
                }
            }

            return {
                executionId,
                workflowId,
                status: "completed",
                context,
            };
        } catch (error) {
            return {
                executionId,
                workflowId,
                status: "failed",
                context,
                error,
            };
        }
    }
}