export type RuntimeState =
    | "created"
    | "initializing"
    | "initialized"
    | "shutting-down"
    | "shutdown"
    | "failed";