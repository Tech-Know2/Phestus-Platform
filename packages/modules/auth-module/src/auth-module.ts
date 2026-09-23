import type {
    PhestusContext,
    PhestusModule,
} from "@phestus/sdk";
import { 
    AuthenticateOptions,
    AuthActor,
    AuthorizeOptions 
} from "./types";

export class AuthModule implements PhestusModule {
    manifest = {
        slug: "auth",
        name: "Auth Module",
        version: "0.1.0",
    };

    constructor() { }

    async authenticate(
        options: AuthenticateOptions,
    ): Promise<AuthActor | null> {
        return null;
    }

    async authorize(
        options: AuthorizeOptions,
    ): Promise<boolean> {
        return false;
    }
}