export interface BullMQQueueProviderConfig {
    connection: {
        host: string;
        port: number;
        username?: string;
        password?: string;
        db?: number;
    };

    defaultJobOptions?: {
        attempts?: number;
        backoff?: {
            type: "fixed" | "exponential";
            delay: number;
        };
        removeOnComplete?: boolean | number;
        removeOnFail?: boolean | number;
    };
}