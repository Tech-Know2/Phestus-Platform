import { PhestusContext } from "../types";

export type PhestusQueryValue =
    | string
    | number
    | boolean
    | null
    | Date
    | PhestusQueryValue[];

export type PhestusQueryOperator =
    | "equals"
    | "notEquals"
    | "contains"
    | "startsWith"
    | "endsWith"
    | "greaterThan"
    | "greaterThanOrEqual"
    | "lessThan"
    | "lessThanOrEqual"
    | "in"
    | "notIn"
    | "exists";

export type PhestusWhereCondition = {
    [operator in PhestusQueryOperator]?: PhestusQueryValue;
};

export interface PhestusWhere {
    fields?: Record<
        string,
        PhestusQueryValue | PhestusWhereCondition
    >;

    and?: PhestusWhere[];
    or?: PhestusWhere[];
    not?: PhestusWhere;
}

export interface PhestusQuery {
    where?: PhestusWhere;
    sort?: string | string[];
    limit?: number;
    offset?: number;
    select?: string[];
}

export interface FindResult<T> {
    docs: T[];
    totalDocs: number;
    limit: number;
    offset: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export type PhestusSchemaType =
    | "string"
    | "number"
    | "boolean"
    | "date"
    | "json"
    | "text"
    | "email"
    | "url"
    | "richText"
    | "array"
    | "object"
    | "relationship";

export type PhestusSchemaValue =
    | string
    | number
    | boolean
    | Date
    | null
    | PhestusSchemaValue[]
    | Record<string, unknown>;

export interface PhestusSchemaValidation {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
}

export interface PhestusSchemaField {
    type: PhestusSchemaType;
    label?: string;
    description?: string;
    required?: boolean;
    unique?: boolean;
    indexed?: boolean;
    default?: PhestusSchemaValue;
    validation?: PhestusSchemaValidation;
    fields?: Record<string, PhestusSchemaField>;
    items?: PhestusSchemaField;
    relation?: {
        collection: string;
        many?: boolean;
    };
}

export interface PhestusSchemaOptions {
    timestamps?: boolean;
    softDelete?: boolean;
    versioning?: boolean;
}

export interface PhestusSchema {
    slug: string;
    name: string;
    version: string;
    fields: Record<string, PhestusSchemaField>;
    options?: PhestusSchemaOptions;
}

export interface PhestusSchemaService {
    get(
        collection: string,
    ): Promise<PhestusSchema | null>;

    exists(
        collection: string,
    ): Promise<boolean>;

    create(
        collection: string,
        schema: PhestusSchema,
    ): Promise<void>;

    update(
        collection: string,
        schema: PhestusSchema,
    ): Promise<void>;

    ensure(
        collection: string,
        schema: PhestusSchema,
    ): Promise<void>;
}

export interface PhestusService {
    schema: PhestusSchemaService;

    initialize?(
        context: PhestusContext,
    ): Promise<void>;

    shutdown?(
        context: PhestusContext,
    ): Promise<void>;

    find<T = unknown>(
        collection: string,
        query?: PhestusQuery,
    ): Promise<FindResult<T>>;

    findById<T = unknown>(
        collection: string,
        id: string,
    ): Promise<T | null>;

    count(
        collection: string,
        query?: PhestusQuery,
    ): Promise<number>;

    create<T = unknown>(
        collection: string,
        data: unknown,
    ): Promise<T>;

    update<T = unknown>(
        collection: string,
        id: string,
        data: unknown,
    ): Promise<T>;

    delete<T = unknown>(
        collection: string,
        id: string,
    ): Promise<T>;
}