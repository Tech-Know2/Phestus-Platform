export class DependencyError extends Error {
    constructor(message: string) {
        super(message);

        this.name = "DependencyError";

        Object.setPrototypeOf(
            this,
            new.target.prototype,
        );
    }
}