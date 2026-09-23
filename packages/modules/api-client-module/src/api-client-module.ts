import type {
    PhestusModule,
} from "@phestus/sdk";
import {
    ApiClientOptions,
    ApiClientRequest,
} from "./types";
import {
    ApiEndpoint,
    ApiResponse
} from "@phestus/api-module"

export class APIClientModule implements PhestusModule {
    manifest = {
        slug: "api-client",
        name: "API Client Module",
        version: "0.1.0",
        dependencies: [
            {
                type: "module" as const,
                slug: "api-module",
                version: "0.1.0",
                optional: false,
            },
        ],
    };

    private baseUrl: string;
    private headers: Record<string, string>;

    constructor(options: ApiClientOptions) {
        this.baseUrl = options.baseUrl;
        this.headers = options.headers ?? {};
    }

    async request<TRequest, TResponse>(
        endpoint: ApiEndpoint<TRequest, TResponse>,
        request: ApiClientRequest<TRequest> = {},
    ): Promise<ApiResponse<TResponse>> {
        const path = this.buildPath(
            endpoint.path,
            request.params ?? {},
        );

        const url = new URL(path, this.baseUrl);

        for (const [key, value] of Object.entries(request.query ?? {})) {
            url.searchParams.set(key, value);
        }

        const response = await fetch(url, {
            method: endpoint.method,
            headers: {
                "Content-Type": "application/json",
                ...this.headers,
            },
            body: request.body === undefined
                ? undefined
                : JSON.stringify(request.body),
        });

        return {
            status: response.status,
            data: await response.json() as TResponse,
        };
    }

    private buildPath(
        path: string,
        params: Record<string, string>,
    ): string {
        return path.replace(
            /:([^/]+)/g,
            (_, key) => {
                const value = params[key];

                if (value === undefined) {
                    throw new Error(`Missing path parameter: ${key}`);
                }

                return encodeURIComponent(value);
            },
        );
    }
}