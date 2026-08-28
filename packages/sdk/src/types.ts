import { Payload } from "payload";
import { Logger } from "./logger";
import { EventBus } from "./event";

export interface PhestusContext {
    payload?: Payload;
    logger: Logger;
    eventBus: EventBus;
}