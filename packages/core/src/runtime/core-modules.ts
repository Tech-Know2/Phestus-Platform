import { EventModule } from "@phestus/event-module";
import { JobModule } from "@phestus/job-module";
import { QueueModule } from "@phestus/queue-module";

export interface CoreModules {
    queue: QueueModule;
    event: EventModule;
    job: JobModule;
}

export function createCoreModules(): CoreModules {
    const queue = new QueueModule();

    const event = new EventModule(
        queue,
    );

    const job = new JobModule(
        queue,
    );

    return {
        queue,
        event,
        job,
    };
}