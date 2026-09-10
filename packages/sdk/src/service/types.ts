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

export interface PhestusService {
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