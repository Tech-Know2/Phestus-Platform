export interface ApiClientOptions {
    baseUrl: string;
    headers?: Record<string, string>;
}

export interface ApiClientRequest<T = unknown> {
    body?: T;
    params?: Record<string, string>;
    query?: Record<string, string>;
}