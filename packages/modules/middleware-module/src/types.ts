export interface MiddlewareRequest {
    method: string;
    path: string;
    body: unknown;
    params: Record<string, string>;
    query: Record<string, string>;
    headers: Record<string, string>;
    context: Record<string, unknown>;
}

export interface MiddlewareResponse {
    status: number;
    data?: unknown;
    headers?: Record<string, string>;
}

export type MiddlewareNext = () => Promise<MiddlewareResponse>;

export interface Middleware {
    name: string;

    handle(
        request: MiddlewareRequest,
        next: MiddlewareNext,
    ): Promise<MiddlewareResponse>;
}

export interface MiddlewareRegistry {
    use(middleware: Middleware): void;
    getMiddleware(): Middleware[];
    execute(
        request: MiddlewareRequest,
        handler: MiddlewareNext,
        middleware?: string[],
    ): Promise<MiddlewareResponse>;
}