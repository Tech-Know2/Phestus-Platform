import type {
    PhestusModule,
} from "@phestus/sdk";
import { Worker, WorkerRequest, WorkerProvider } from "@phestus/sdk";

export class WorkerModule implements PhestusModule {
    manifest = {
        slug: "worker",
        name: "Worker Module",
        version: "0.1.0",
    };

    constructor(
        private readonly provider: WorkerProvider,
    ) { }

    registerWorker(worker: Worker) {
        return this.provider.registerWorker(worker);
    }

    getWorker(id: string) {
        return this.provider.getWorker(id);
    }

    listWorkers() {
        return this.provider.listWorkers();
    }

    removeWorker(id: string) {
        return this.provider.removeWorker(id);
    }

    updateWorker(
        id: string,
        worker: Partial<Worker>,
    ) {
        return this.provider.updateWorker(id, worker);
    }

    dispatch<T>(request: WorkerRequest<T>) {
        return this.provider.dispatch(request);
    }

    heartbeat(id: string) {
        return this.provider.heartbeat(id);
    }

    getHealth(id: string) {
        return this.provider.getHealth(id);
    }

}