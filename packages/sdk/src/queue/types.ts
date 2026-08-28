export interface Queue {
    add<TData = unknown>(
        name: string,
        data: TData
    ): Promise<void>;
}