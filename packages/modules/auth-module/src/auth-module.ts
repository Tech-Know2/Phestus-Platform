import type {
    PhestusModule,
} from "@phestus/sdk";
import type {
    AuthenticateOptions,
    AuthActor,
    AuthorizeOptions,
    AuthProvider
} from "./types";

export class AuthModule implements PhestusModule {
    manifest = {
        slug: "auth",
        name: "Auth Module",
        version: "0.1.0",
    };

    constructor(
        private readonly provider: AuthProvider,
    ) { }

    authenticate(options: AuthenticateOptions) {
        return this.provider.authenticate(options);
    }

    authorize(options: AuthorizeOptions) {
        return this.provider.authorize(options);
    }
}