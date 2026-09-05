export class ValidationError extends Error {
    constructor(message: string) {
        super(message);

        this.name = "ValidationError";

        Object.setPrototypeOf(
            this,
            new.target.prototype,
        );
    }
}