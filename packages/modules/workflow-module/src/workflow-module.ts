import type {
    Logger,
    ModuleManifest,
    PhestusContext,
    PhestusModule,
} from "@phestus/sdk";

import { EventModule } from "@phestus/event-module";
import { QueueModule } from "@phestus/queue-module";
import { JobModule } from "@phestus/job-module";

import type {
    WorkflowDefinition,
    WorkflowExecutionResult,
    WorkflowStepDefinition,
} from "./types";

import { WorkflowRegistry } from "./workflow-registry";
import { WorkflowStepRegistry } from "./workflow-step-registry";
import { WorkflowEngine } from "./workflow-engine";

export class WorkflowModule implements PhestusModule {
    manifest: ModuleManifest = {
        slug: "workflow",
        name: "Workflow Module",
        version: "0.1.0",

        dependencies: [
            {
                type: "module",
                slug: "queue",
                version: "0.1.0",
                optional: false,
            },
            {
                type: "module",
                slug: "event",
                version: "0.1.0",
                optional: false,
            },
            {
                type: "module",
                slug: "job",
                version: "0.1.0",
                optional: false,
            },
        ],
    };

    readonly registry: WorkflowRegistry;
    readonly stepRegistry: WorkflowStepRegistry;

    private engine!: WorkflowEngine;
    private readonly unsubscribers: Array<() => Promise<void> | void> = [];

    constructor(
        private readonly queue: QueueModule,
        private readonly event: EventModule,
        private readonly job: JobModule,
    ) {
        this.registry = new WorkflowRegistry();
        this.stepRegistry = new WorkflowStepRegistry();
    }

    async initialize(
        context: PhestusContext
    ): Promise<void> {
        this.engine = new WorkflowEngine(
            this.registry,
            this.stepRegistry,
            this.job,
            context.logger,
        );

        for (const workflow of this.registry.list()) {
            for (const trigger of workflow.triggers ?? []) {
                const unsubscribe =
                    await this.event.subscribe(
                        trigger.event,
                        {
                            handle: async (event) => {
                                await this.engine.execute(
                                    workflow.slug,
                                    event.data,
                                    event,
                                );
                            },
                        },
                    );

                this.unsubscribers.push(
                    unsubscribe,
                );
            }
        }

        context.logger.info(
            "Workflow Module initialized",
        );
    }

    async shutdown(): Promise<void> {
        for (const unsubscribe of this.unsubscribers) {
            await unsubscribe();
        }

        this.unsubscribers.length = 0;

        this.registry.clear();
        this.stepRegistry.clear();
    }

    register(
        workflow: WorkflowDefinition
    ): void {
        this.registry.register(workflow);
    }

    unregister(
        workflowId: string
    ): boolean {
        return this.registry.unregister(
            workflowId
        );
    }

    registerStep(
        step: WorkflowStepDefinition
    ): void {
        this.stepRegistry.register(step);
    }

    unregisterStep(
        type: string
    ): boolean {
        return this.stepRegistry.unregister(type);
    }

    async run<TInput = unknown>(
        workflowId: string,
        input: TInput
    ): Promise<WorkflowExecutionResult> {
        return this.engine.execute(
            workflowId,
            input,
        );
    }
}