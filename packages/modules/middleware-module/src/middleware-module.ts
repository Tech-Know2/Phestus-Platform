import type {
    PhestusModule,
} from "@phestus/sdk";

import type {
    Middleware,
    MiddlewareRegistry,
    MiddlewareNext,
    MiddlewareRequest,
    MiddlewareResponse,
} from "./types";

export class MiddlewareModule implements PhestusModule, MiddlewareRegistry {
    manifest = {
        slug: "middleware",
        name: "Middleware Module",
        version: "0.1.0",
    };

    private middleware: Middleware[] = [];

    use(middleware: Middleware): void {
        this.middleware.push(middleware);
    }

    getMiddleware(): Middleware[] {
        return [...this.middleware];
    }

    async execute(
        request: MiddlewareRequest,
        handler: MiddlewareNext,
        middleware: string[] = [],
    ): Promise<MiddlewareResponse> {
        const selected = middleware.length
            ? this.middleware.filter((item) =>
                middleware.includes(item.name),
            )
            : this.middleware;

        let index = -1;

        const next = async (): Promise<MiddlewareResponse> => {
            index++;

            const current = selected[index];

            if (!current) {
                return handler();
            }

            return current.handle(request, next);
        };

        return next();
    }
}