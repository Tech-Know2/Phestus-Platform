import type {
    PhestusProvider,
} from "@phestus/sdk";

export interface AuthActor {
    id: string;
    type: string;
    metadata?: Record<string, unknown>;
}

export interface AuthenticateOptions {
    request: unknown;
}

export interface AuthorizeOptions {
    actor: AuthActor;
    action: string;
    resource?: unknown;
    context?: Record<string, unknown>;
    provider?: string;
}

export interface AuthProvider extends PhestusProvider {
    authenticate(
        options: AuthenticateOptions,
    ): Promise<AuthActor | null>;

    authorize(
        options: AuthorizeOptions,
    ): Promise<boolean>;
}