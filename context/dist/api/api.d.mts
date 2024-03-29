import { av as paths$7, N as ManifestV2 } from '../types-R41eD1zH.mjs';
import 'mitt';

type LimitPolicy = <ReturnValue>(func: () => Promise<ReturnValue>) => Promise<ReturnValue>;
declare const nullLimitPolicy: LimitPolicy;
declare const defaultLimitPolicy: LimitPolicy;
type ClientOptions = {
    /** The Uniform API host to use. Internal use. */
    apiHost?: string;
    /** The Uniform API key to use when sending API requests. This or bearer token must be specified. */
    apiKey?: string | null;
    /** The Uniform bearer token to use. Internal use. */
    bearerToken?: string | null;
    /** The Uniform project ID to connect to */
    projectId?: string | null;
    /** Specify a fetch implementation to use when fetching data. Useful if you want to only polyfill selectively. */
    fetch?: typeof fetch;
    /**
     * Specify how to retry and throttle requests.
     * Default: allow 6 concurrent requests max.
     */
    limitPolicy?: LimitPolicy;
    /** Specify whether caching is disabled. */
    bypassCache?: boolean;
};
type ExceptProject<T> = Omit<T, 'projectId'>;
declare class ApiClientError extends Error {
    errorMessage: string;
    fetchMethod: string;
    fetchUri: string;
    statusCode?: number | undefined;
    statusText?: string | undefined;
    requestId?: string | undefined;
    constructor(errorMessage: string, fetchMethod: string, fetchUri: string, statusCode?: number | undefined, statusText?: string | undefined, requestId?: string | undefined);
}

declare class ApiClient<TOptions extends ClientOptions = ClientOptions> {
    protected options: TOptions;
    constructor(options: TOptions);
    protected apiClient<TResponse>(fetchUri: URL, options?: RequestInit & {
        /** Whether to expect a JSON response or not */
        expectNoContent?: boolean;
    }): Promise<TResponse>;
    protected createUrl(path: string, queryParams?: Record<string, string | boolean | undefined | null | number | Array<string | boolean | number>>, hostOverride?: string): URL;
    private ensureApiHost;
    private static getRequestId;
}
declare function handleRateLimits(callApi: () => Promise<Response>): Promise<Response>;

interface components$6 {
    schemas: {
        EnrichmentCategory: {
            /** @description The maximum visitor score allowed for enrichment keys in this category */
            cap: number;
        };
        PreviewSignal: components$6["schemas"]["Signal"] & {
            /** @description Friendly name of the signal */
            name: string;
            /** @description Description of the signal */
            description?: string;
        };
        Signal: {
            /** @description The signal strength per activation (each time its criteria are true, this score is added) */
            str: number;
            /** @description The maximum visitor score allowed for this signal */
            cap: number;
            /**
             * @description How long the signal's score should persist
             * 's' = current session (expires after a period of inactivity)
             * 'p' = permanent (expires as far in the future as possible, may be limited by browser security settings)
             * 't' = transient (score tracks the current state of the criteria every time scores are updated)
             *
             * @enum {string}
             */
            dur: "s" | "p" | "t";
            crit: components$6["schemas"]["RootSignalCriteriaGroup"];
        };
        RootSignalCriteriaGroup: {
            /**
             * @description Criteria type (Group of other criteria)
             * @enum {string}
             */
            type: "G";
            /**
             * @description The logical operator to apply to the criteria groups
             * & = AND
             * | = OR
             *
             * Default is `&` if unspecified.
             *
             * @default &
             * @enum {string}
             */
            op?: "&" | "|";
            /** @description The criteria clauses that make up this grouping of criteria */
            clauses: (components$6["schemas"]["SignalCriteriaGroup"] | components$6["schemas"]["SignalCriteria"])[];
        };
        SignalCriteriaGroup: {
            /**
             * @description Criteria type (Group of other criteria)
             * @enum {string}
             */
            type: "G";
            /**
             * @description The logical operator to apply to the criteria groups
             * & = AND
             * | = OR
             *
             * Default is `&` if unspecified.
             *
             * @enum {string}
             */
            op?: "&" | "|";
            /** @description The criteria clauses that make up this grouping of criteria */
            clauses: (components$6["schemas"]["SignalCriteriaGroup"] | components$6["schemas"]["SignalCriteria"])[];
        };
        SignalCriteria: components$6["schemas"]["CookieCriteria"] | components$6["schemas"]["QueryStringCriteria"] | components$6["schemas"]["QuirkCriteria"] | components$6["schemas"]["EventCriteria"] | components$6["schemas"]["CurrentPageCriteria"] | components$6["schemas"]["PageViewCountCriteria"];
        /** @description Matches a URL query string parameter value */
        QueryStringCriteria: {
            /** @enum {string} */
            type: "QS";
            /** @description The name of the query string parameter to match */
            queryName: string;
            /** @description The value to match the query string parameter against */
            match: components$6["schemas"]["StringMatch"];
        };
        /** @description Matches a web cookie value */
        CookieCriteria: {
            /** @enum {string} */
            type: "CK";
            /** @description The name of the cookie to match */
            cookieName: string;
            /** @description The value to match the cookie against */
            match: components$6["schemas"]["StringMatch"];
        };
        /** @description Matches a visitor quirk key and value */
        QuirkCriteria: {
            /** @enum {string} */
            type: "QK";
            /** @description The name of the quirk key to match */
            key: string;
            /** @description The quirk value to match against */
            match: components$6["schemas"]["StringMatch"];
        };
        /** @description Matches an analytics event name being fired */
        EventCriteria: {
            /** @enum {string} */
            type: "EVT";
            /** @description How to match the event name */
            event: components$6["schemas"]["StringMatch"];
        };
        /**
         * @description Matches the current page's absolute path (i.e. /path/to/page.html)
         * Does not include the query string or protocol and hostname (i.e. NOT https://foo.com/path/to/page.html?query=something)
         */
        CurrentPageCriteria: {
            /** @enum {string} */
            type: "PV";
            /** @description The page/route path to match as a page that has been visited */
            path: components$6["schemas"]["StringMatch"];
        };
        PageViewCountCriteria: {
            /** @enum {string} */
            type: "PVC";
            /** @description The expression to match the page view count against */
            match: components$6["schemas"]["NumberMatch"];
        };
        /** @description Describes a match expression on a string */
        StringMatch: {
            /** @description The right hand side of the match expression */
            rhs: string;
            /**
             * @description The match operator
             * '=' = exact match
             * '~' = contains match
             * '//' = regular expression match
             *
             * Any of the above can be prefixed with '!' to invert the match (i.e. != for 'not an exact match')
             *
             * @enum {string}
             */
            op: "=" | "~" | "//" | "!=" | "!~" | "!//";
            /** @description The case sensitivity of the match. Defaults to false if unspecified. */
            cs?: boolean;
        } | {
            /**
             * @description The type of match to perform
             * '*' = exists with any value
             * '!*' = does not exist
             *
             * @enum {string}
             */
            op: "*" | "!*";
        };
        /** @description Describes a match expression on a number */
        NumberMatch: {
            /** @description The right hand side of the match expression */
            rhs: number;
            /**
             * @description The type of match to perform
             * '=' = exact match
             * '!=' = not an exact match
             * '<' = less than match expression
             * '>' = greater than match expression
             *
             * @enum {string}
             */
            op: "=" | "<" | ">" | "!=";
        };
        /** @description Defines an aggregate dimension that is a grouping of other dimensions' scores; an intent or audience. */
        AggregateDimension: {
            /** @description Input dimensions to the aggregate dimension */
            inputs: components$6["schemas"]["AggregateDimensionInput"][];
        };
        /** @description Defines an input dimension to an aggregate dimension */
        AggregateDimensionInput: {
            /**
             * @description Dimension name to reference as an input.
             * For enrichment inputs, use CATEGORY_KEY as the dimension.
             * Enrichments, signals, and other aggregate dimensions may be referenced.
             *
             * Note that creating a cycle of aggregate dimensions is allowed, however
             * the final score will _ignore_ the cycled aggregate dimension in the result.
             * This can be used to create mutually exclusive aggregates.
             */
            dim: string;
            /**
             * @description The sign of the input dimension controls how it affects the aggregate dimension's final score.
             *
             * '+' = add to the final score
             * '-' = subtract from the final score
             * 'c' = clear the final score (if the input dimension has any score at all, this aggreate will have no score regardless of other inputs)
             *
             * Default if unspecified: '+'
             *
             * @default +
             * @enum {string}
             */
            sign?: "+" | "-" | "c";
        };
        Test: {
            /** @description Winning variation ID - if set, the test will not run and this variation is shown to all visitors (the test is closed) */
            wv?: string;
        };
    };
}

/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */
interface paths$6 {
    "/api/v1/enrichment-values": {
        put: {
            responses: {
                /** OK */
                204: never;
                400: external$6["swagger.yml"]["components"]["responses"]["BadRequestError"];
                401: external$6["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                403: external$6["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                429: external$6["swagger.yml"]["components"]["responses"]["RateLimitError"];
                500: external$6["swagger.yml"]["components"]["responses"]["InternalServerError"];
            };
            requestBody: {
                content: {
                    "application/json": {
                        enrichmentValue: external$6["v1-enrichments.swagger.yml"]["components"]["schemas"]["EnrichmentValue"];
                        enrichmentId: string;
                        /** Format: uuid */
                        projectId: string;
                    };
                };
            };
        };
        delete: {
            responses: {
                /** OK */
                204: never;
                400: external$6["swagger.yml"]["components"]["responses"]["BadRequestError"];
                401: external$6["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                403: external$6["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                /** Parent enrichment category was not found */
                404: unknown;
                429: external$6["swagger.yml"]["components"]["responses"]["RateLimitError"];
                500: external$6["swagger.yml"]["components"]["responses"]["InternalServerError"];
            };
            requestBody: {
                content: {
                    "application/json": {
                        enrichmentId: string;
                        /** Format: uuid */
                        projectId: string;
                        enrichmentValueId: string;
                    };
                };
            };
        };
        /** Handles preflight requests. This endpoint allows CORS. */
        options: {
            responses: {
                /** OK */
                204: never;
            };
        };
    };
}
interface external$6 {
    "swagger.yml": {
        paths: {};
        components: {
            schemas: {
                Error: {
                    /** @description Error message(s) that occurred while processing the request */
                    errorMessage?: string[] | string;
                };
            };
            responses: {
                /** Request input validation failed */
                BadRequestError: {
                    content: {
                        "application/json": external$6["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** API key or token was not valid */
                UnauthorizedError: {
                    content: {
                        "application/json": external$6["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Permission was denied */
                ForbiddenError: {
                    content: {
                        "application/json": external$6["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Resource not found */
                NotFoundError: {
                    content: {
                        "application/json": external$6["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Too many requests in allowed time period */
                RateLimitError: unknown;
                /** Execution error occurred */
                InternalServerError: unknown;
            };
        };
        operations: {};
    };
    "v1-enrichments.swagger.yml": {
        paths: {
            "/api/v1/enrichments": {
                get: {
                    parameters: {
                        query: {
                            projectId: string;
                        };
                    };
                    responses: {
                        /** OK */
                        200: {
                            content: {
                                "application/json": {
                                    enrichments: external$6["v1-enrichments.swagger.yml"]["components"]["schemas"]["EnrichmentCategoryWithValues"][];
                                };
                            };
                        };
                        400: external$6["swagger.yml"]["components"]["responses"]["BadRequestError"];
                        401: external$6["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                        403: external$6["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                        429: external$6["swagger.yml"]["components"]["responses"]["RateLimitError"];
                        500: external$6["swagger.yml"]["components"]["responses"]["InternalServerError"];
                    };
                };
                put: {
                    responses: {
                        /** OK */
                        204: never;
                        400: external$6["swagger.yml"]["components"]["responses"]["BadRequestError"];
                        401: external$6["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                        403: external$6["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                        429: external$6["swagger.yml"]["components"]["responses"]["RateLimitError"];
                        500: external$6["swagger.yml"]["components"]["responses"]["InternalServerError"];
                    };
                    requestBody: {
                        content: {
                            "application/json": {
                                enrichment: external$6["v1-enrichments.swagger.yml"]["components"]["schemas"]["EnrichmentCategory"];
                                /** Format: uuid */
                                projectId: string;
                            };
                        };
                    };
                };
                delete: {
                    responses: {
                        /** OK */
                        204: never;
                        400: external$6["swagger.yml"]["components"]["responses"]["BadRequestError"];
                        401: external$6["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                        403: external$6["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                        429: external$6["swagger.yml"]["components"]["responses"]["RateLimitError"];
                        500: external$6["swagger.yml"]["components"]["responses"]["InternalServerError"];
                    };
                    requestBody: {
                        content: {
                            "application/json": {
                                enrichmentId: string;
                                /** Format: uuid */
                                projectId: string;
                            };
                        };
                    };
                };
                /** Handles preflight requests. This endpoint allows CORS. */
                options: {
                    responses: {
                        /** OK */
                        204: never;
                    };
                };
            };
        };
        components: {
            schemas: {
                EnrichmentCategory: {
                    /** @description Public ID of the enrichment category */
                    id: string;
                    /** @description Display name of the enrichment category */
                    name: string;
                    /** @description Optional sort order of the enrichment category (if not set, sorts by name) */
                    sortOrder?: number | null;
                    /**
                     * @description The maximum visitor score allowed for enrichment keys in this category
                     * @default 99999999
                     */
                    cap?: number;
                };
                EnrichmentCategoryWithValues: external$6["v1-enrichments.swagger.yml"]["components"]["schemas"]["EnrichmentCategory"] & {
                    values: external$6["v1-enrichments.swagger.yml"]["components"]["schemas"]["EnrichmentValue"][];
                };
                EnrichmentValue: {
                    /** @description Public ID of the enrichment value */
                    id: string;
                    /** @description Display name of the enrichment value */
                    value: string;
                    /** @description Optional sort order of the enrichment value (if not set, sorts by name) */
                    sortOrder?: number | null;
                };
            };
        };
        operations: {};
    };
}

/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */
interface paths$5 {
    "/api/v1/enrichments": {
        get: {
            parameters: {
                query: {
                    projectId: string;
                };
            };
            responses: {
                /** OK */
                200: {
                    content: {
                        "application/json": {
                            enrichments: components$5["schemas"]["EnrichmentCategoryWithValues"][];
                        };
                    };
                };
                400: external$5["swagger.yml"]["components"]["responses"]["BadRequestError"];
                401: external$5["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                403: external$5["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                429: external$5["swagger.yml"]["components"]["responses"]["RateLimitError"];
                500: external$5["swagger.yml"]["components"]["responses"]["InternalServerError"];
            };
        };
        put: {
            responses: {
                /** OK */
                204: never;
                400: external$5["swagger.yml"]["components"]["responses"]["BadRequestError"];
                401: external$5["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                403: external$5["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                429: external$5["swagger.yml"]["components"]["responses"]["RateLimitError"];
                500: external$5["swagger.yml"]["components"]["responses"]["InternalServerError"];
            };
            requestBody: {
                content: {
                    "application/json": {
                        enrichment: components$5["schemas"]["EnrichmentCategory"];
                        /** Format: uuid */
                        projectId: string;
                    };
                };
            };
        };
        delete: {
            responses: {
                /** OK */
                204: never;
                400: external$5["swagger.yml"]["components"]["responses"]["BadRequestError"];
                401: external$5["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                403: external$5["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                429: external$5["swagger.yml"]["components"]["responses"]["RateLimitError"];
                500: external$5["swagger.yml"]["components"]["responses"]["InternalServerError"];
            };
            requestBody: {
                content: {
                    "application/json": {
                        enrichmentId: string;
                        /** Format: uuid */
                        projectId: string;
                    };
                };
            };
        };
        /** Handles preflight requests. This endpoint allows CORS. */
        options: {
            responses: {
                /** OK */
                204: never;
            };
        };
    };
}
interface components$5 {
    schemas: {
        EnrichmentCategory: {
            /** @description Public ID of the enrichment category */
            id: string;
            /** @description Display name of the enrichment category */
            name: string;
            /** @description Optional sort order of the enrichment category (if not set, sorts by name) */
            sortOrder?: number | null;
            /**
             * @description The maximum visitor score allowed for enrichment keys in this category
             * @default 99999999
             */
            cap?: number;
        };
        EnrichmentCategoryWithValues: components$5["schemas"]["EnrichmentCategory"] & {
            values: components$5["schemas"]["EnrichmentValue"][];
        };
        EnrichmentValue: {
            /** @description Public ID of the enrichment value */
            id: string;
            /** @description Display name of the enrichment value */
            value: string;
            /** @description Optional sort order of the enrichment value (if not set, sorts by name) */
            sortOrder?: number | null;
        };
    };
}
interface external$5 {
    "swagger.yml": {
        paths: {};
        components: {
            schemas: {
                Error: {
                    /** @description Error message(s) that occurred while processing the request */
                    errorMessage?: string[] | string;
                };
            };
            responses: {
                /** Request input validation failed */
                BadRequestError: {
                    content: {
                        "application/json": external$5["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** API key or token was not valid */
                UnauthorizedError: {
                    content: {
                        "application/json": external$5["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Permission was denied */
                ForbiddenError: {
                    content: {
                        "application/json": external$5["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Resource not found */
                NotFoundError: {
                    content: {
                        "application/json": external$5["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Too many requests in allowed time period */
                RateLimitError: unknown;
                /** Execution error occurred */
                InternalServerError: unknown;
            };
        };
        operations: {};
    };
}

/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */
interface paths$4 {
    "/api/v2/aggregate": {
        get: {
            parameters: {
                query: {
                    /** The project to fetch aggregates for */
                    projectId: string;
                    /** Limit the results to a specific aggregate ID */
                    aggregateId?: string;
                    /**
                     * Limit the results to a specific aggregate type
                     * 0: Audience
                     * 1: Intent
                     */
                    type?: 0 | 1;
                };
            };
            responses: {
                /** OK */
                200: {
                    content: {
                        "application/json": {
                            aggregates: components$4["schemas"]["AggregateData"][];
                        };
                    };
                };
                400: external$4["swagger.yml"]["components"]["responses"]["BadRequestError"];
                401: external$4["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                403: external$4["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                429: external$4["swagger.yml"]["components"]["responses"]["RateLimitError"];
                500: external$4["swagger.yml"]["components"]["responses"]["InternalServerError"];
            };
        };
        put: {
            responses: {
                /** OK */
                204: never;
                400: external$4["swagger.yml"]["components"]["responses"]["BadRequestError"];
                401: external$4["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                403: external$4["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                429: external$4["swagger.yml"]["components"]["responses"]["RateLimitError"];
                500: external$4["swagger.yml"]["components"]["responses"]["InternalServerError"];
            };
            requestBody: {
                content: {
                    "application/json": {
                        aggregate: components$4["schemas"]["AggregateData"];
                        /** Format: uuid */
                        projectId: string;
                        /**
                         * @description Skips updating aggregate inputs and upserts only the aggregate definition.
                         * Inputs data is still required, but is ignored and not saved or validated.
                         * Useful when creating aggregates that reference each other: Create the definitions, then the inputs.
                         *
                         * @default false
                         */
                        skipInputs?: boolean;
                    };
                };
            };
        };
        delete: {
            responses: {
                /** OK */
                204: never;
                400: external$4["swagger.yml"]["components"]["responses"]["BadRequestError"];
                401: external$4["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                403: external$4["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                429: external$4["swagger.yml"]["components"]["responses"]["RateLimitError"];
                500: external$4["swagger.yml"]["components"]["responses"]["InternalServerError"];
            };
            requestBody: {
                content: {
                    "application/json": {
                        aggregateId: string;
                        /** Format: uuid */
                        projectId: string;
                    };
                };
            };
        };
        /** Handles preflight requests. This endpoint allows CORS. */
        options: {
            responses: {
                /** OK */
                204: never;
            };
        };
    };
}
interface components$4 {
    schemas: {
        AggregateData: {
            id: string;
            name: string;
            description?: string;
            /**
             * @description The type of aggregate
             * 0: Audience
             * 1: Intent
             *
             * @enum {number}
             */
            type: 0 | 1;
            inputs: external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["AggregateDimensionInput"][];
        };
    };
}
interface external$4 {
    "swagger.yml": {
        paths: {};
        components: {
            schemas: {
                Error: {
                    /** @description Error message(s) that occurred while processing the request */
                    errorMessage?: string[] | string;
                };
            };
            responses: {
                /** Request input validation failed */
                BadRequestError: {
                    content: {
                        "application/json": external$4["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** API key or token was not valid */
                UnauthorizedError: {
                    content: {
                        "application/json": external$4["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Permission was denied */
                ForbiddenError: {
                    content: {
                        "application/json": external$4["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Resource not found */
                NotFoundError: {
                    content: {
                        "application/json": external$4["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Too many requests in allowed time period */
                RateLimitError: unknown;
                /** Execution error occurred */
                InternalServerError: unknown;
            };
        };
        operations: {};
    };
    "uniform-context-types.swagger.yml": {
        paths: {};
        components: {
            schemas: {
                EnrichmentCategory: {
                    /** @description The maximum visitor score allowed for enrichment keys in this category */
                    cap: number;
                };
                PreviewSignal: external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["Signal"] & {
                    /** @description Friendly name of the signal */
                    name: string;
                    /** @description Description of the signal */
                    description?: string;
                };
                Signal: {
                    /** @description The signal strength per activation (each time its criteria are true, this score is added) */
                    str: number;
                    /** @description The maximum visitor score allowed for this signal */
                    cap: number;
                    /**
                     * @description How long the signal's score should persist
                     * 's' = current session (expires after a period of inactivity)
                     * 'p' = permanent (expires as far in the future as possible, may be limited by browser security settings)
                     * 't' = transient (score tracks the current state of the criteria every time scores are updated)
                     *
                     * @enum {string}
                     */
                    dur: "s" | "p" | "t";
                    crit: external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["RootSignalCriteriaGroup"];
                };
                RootSignalCriteriaGroup: {
                    /**
                     * @description Criteria type (Group of other criteria)
                     * @enum {string}
                     */
                    type: "G";
                    /**
                     * @description The logical operator to apply to the criteria groups
                     * & = AND
                     * | = OR
                     *
                     * Default is `&` if unspecified.
                     *
                     * @default &
                     * @enum {string}
                     */
                    op?: "&" | "|";
                    /** @description The criteria clauses that make up this grouping of criteria */
                    clauses: (external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["SignalCriteriaGroup"] | external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["SignalCriteria"])[];
                };
                SignalCriteriaGroup: {
                    /**
                     * @description Criteria type (Group of other criteria)
                     * @enum {string}
                     */
                    type: "G";
                    /**
                     * @description The logical operator to apply to the criteria groups
                     * & = AND
                     * | = OR
                     *
                     * Default is `&` if unspecified.
                     *
                     * @enum {string}
                     */
                    op?: "&" | "|";
                    /** @description The criteria clauses that make up this grouping of criteria */
                    clauses: (external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["SignalCriteriaGroup"] | external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["SignalCriteria"])[];
                };
                SignalCriteria: external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["CookieCriteria"] | external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["QueryStringCriteria"] | external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["QuirkCriteria"] | external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["EventCriteria"] | external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["CurrentPageCriteria"] | external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["PageViewCountCriteria"];
                /** @description Matches a URL query string parameter value */
                QueryStringCriteria: {
                    /** @enum {string} */
                    type: "QS";
                    /** @description The name of the query string parameter to match */
                    queryName: string;
                    /** @description The value to match the query string parameter against */
                    match: external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["StringMatch"];
                };
                /** @description Matches a web cookie value */
                CookieCriteria: {
                    /** @enum {string} */
                    type: "CK";
                    /** @description The name of the cookie to match */
                    cookieName: string;
                    /** @description The value to match the cookie against */
                    match: external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["StringMatch"];
                };
                /** @description Matches a visitor quirk key and value */
                QuirkCriteria: {
                    /** @enum {string} */
                    type: "QK";
                    /** @description The name of the quirk key to match */
                    key: string;
                    /** @description The quirk value to match against */
                    match: external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["StringMatch"];
                };
                /** @description Matches an analytics event name being fired */
                EventCriteria: {
                    /** @enum {string} */
                    type: "EVT";
                    /** @description How to match the event name */
                    event: external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["StringMatch"];
                };
                /**
                 * @description Matches the current page's absolute path (i.e. /path/to/page.html)
                 * Does not include the query string or protocol and hostname (i.e. NOT https://foo.com/path/to/page.html?query=something)
                 */
                CurrentPageCriteria: {
                    /** @enum {string} */
                    type: "PV";
                    /** @description The page/route path to match as a page that has been visited */
                    path: external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["StringMatch"];
                };
                PageViewCountCriteria: {
                    /** @enum {string} */
                    type: "PVC";
                    /** @description The expression to match the page view count against */
                    match: external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["NumberMatch"];
                };
                /** @description Describes a match expression on a string */
                StringMatch: {
                    /** @description The right hand side of the match expression */
                    rhs: string;
                    /**
                     * @description The match operator
                     * '=' = exact match
                     * '~' = contains match
                     * '//' = regular expression match
                     *
                     * Any of the above can be prefixed with '!' to invert the match (i.e. != for 'not an exact match')
                     *
                     * @enum {string}
                     */
                    op: "=" | "~" | "//" | "!=" | "!~" | "!//";
                    /** @description The case sensitivity of the match. Defaults to false if unspecified. */
                    cs?: boolean;
                } | {
                    /**
                     * @description The type of match to perform
                     * '*' = exists with any value
                     * '!*' = does not exist
                     *
                     * @enum {string}
                     */
                    op: "*" | "!*";
                };
                /** @description Describes a match expression on a number */
                NumberMatch: {
                    /** @description The right hand side of the match expression */
                    rhs: number;
                    /**
                     * @description The type of match to perform
                     * '=' = exact match
                     * '!=' = not an exact match
                     * '<' = less than match expression
                     * '>' = greater than match expression
                     *
                     * @enum {string}
                     */
                    op: "=" | "<" | ">" | "!=";
                };
                /** @description Defines an aggregate dimension that is a grouping of other dimensions' scores; an intent or audience. */
                AggregateDimension: {
                    /** @description Input dimensions to the aggregate dimension */
                    inputs: external$4["uniform-context-types.swagger.yml"]["components"]["schemas"]["AggregateDimensionInput"][];
                };
                /** @description Defines an input dimension to an aggregate dimension */
                AggregateDimensionInput: {
                    /**
                     * @description Dimension name to reference as an input.
                     * For enrichment inputs, use CATEGORY_KEY as the dimension.
                     * Enrichments, signals, and other aggregate dimensions may be referenced.
                     *
                     * Note that creating a cycle of aggregate dimensions is allowed, however
                     * the final score will _ignore_ the cycled aggregate dimension in the result.
                     * This can be used to create mutually exclusive aggregates.
                     */
                    dim: string;
                    /**
                     * @description The sign of the input dimension controls how it affects the aggregate dimension's final score.
                     *
                     * '+' = add to the final score
                     * '-' = subtract from the final score
                     * 'c' = clear the final score (if the input dimension has any score at all, this aggreate will have no score regardless of other inputs)
                     *
                     * Default if unspecified: '+'
                     *
                     * @default +
                     * @enum {string}
                     */
                    sign?: "+" | "-" | "c";
                };
                Test: {
                    /** @description Winning variation ID - if set, the test will not run and this variation is shown to all visitors (the test is closed) */
                    wv?: string;
                };
            };
        };
        operations: {};
    };
}

/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */
interface paths$3 {
    "/api/v2/dimension": {
        get: {
            parameters: {
                query: {
                    /** The project to fetch dimensions for */
                    projectId: string;
                };
            };
            responses: {
                /** OK */
                200: {
                    content: {
                        "application/json": {
                            dimensions: components$3["schemas"]["DimensionDefinition"][];
                        };
                    };
                };
                400: external$3["swagger.yml"]["components"]["responses"]["BadRequestError"];
                401: external$3["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                403: external$3["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                429: external$3["swagger.yml"]["components"]["responses"]["RateLimitError"];
                500: external$3["swagger.yml"]["components"]["responses"]["InternalServerError"];
            };
        };
        /** Handles preflight requests. This endpoint allows CORS. */
        options: {
            responses: {
                /** OK */
                204: never;
            };
        };
    };
}
interface components$3 {
    schemas: {
        DimensionDefinition: {
            /** @description The dimension name (score key) */
            dim: string;
            /**
             * @description The dimension type
             * AGG: Aggregation (intent or audience)
             * ENR: Enrichment
             * SIG: Signal
             *
             * @enum {string}
             */
            category: "AGG" | "ENR" | "SIG";
            /**
             * @description Subtype of the dimension
             * AGG:0: Audience
             * AGG:1: Intent
             * ENR: Enrichment Category name
             * SIG: null
             */
            subcategory?: string;
            /** @description The dimension's name (without category) */
            name: string;
            /** @description The minimum score possible for the dimension */
            min: number;
            /** @description The maximum score possible for the dimension */
            cap: number;
        };
    };
}
interface external$3 {
    "swagger.yml": {
        paths: {};
        components: {
            schemas: {
                Error: {
                    /** @description Error message(s) that occurred while processing the request */
                    errorMessage?: string[] | string;
                };
            };
            responses: {
                /** Request input validation failed */
                BadRequestError: {
                    content: {
                        "application/json": external$3["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** API key or token was not valid */
                UnauthorizedError: {
                    content: {
                        "application/json": external$3["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Permission was denied */
                ForbiddenError: {
                    content: {
                        "application/json": external$3["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Resource not found */
                NotFoundError: {
                    content: {
                        "application/json": external$3["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Too many requests in allowed time period */
                RateLimitError: unknown;
                /** Execution error occurred */
                InternalServerError: unknown;
            };
        };
        operations: {};
    };
}

/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */
interface paths$2 {
    "/api/v2/quirk": {
        /** Gets quirk definitions for a project */
        get: {
            parameters: {
                query: {
                    /** The project to fetch quirk definitions for */
                    projectId: string;
                    /** Limit the results to a specific quirk ID */
                    quirkId?: string;
                    /** Include quirks that are defined by integrations */
                    withIntegrations?: boolean;
                };
            };
            responses: {
                /** OK */
                200: {
                    content: {
                        "application/json": {
                            quirks: components$2["schemas"]["Quirk"][];
                        };
                    };
                };
                400: external$2["swagger.yml"]["components"]["responses"]["BadRequestError"];
                401: external$2["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                403: external$2["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                429: external$2["swagger.yml"]["components"]["responses"]["RateLimitError"];
                500: external$2["swagger.yml"]["components"]["responses"]["InternalServerError"];
            };
        };
        put: {
            responses: {
                /** OK */
                204: never;
                400: external$2["swagger.yml"]["components"]["responses"]["BadRequestError"];
                401: external$2["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                403: external$2["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                429: external$2["swagger.yml"]["components"]["responses"]["RateLimitError"];
                500: external$2["swagger.yml"]["components"]["responses"]["InternalServerError"];
            };
            requestBody: {
                content: {
                    "application/json": {
                        quirk: components$2["schemas"]["Quirk"];
                        /** Format: uuid */
                        projectId: string;
                    };
                };
            };
        };
        delete: {
            responses: {
                /** OK */
                204: never;
                400: external$2["swagger.yml"]["components"]["responses"]["BadRequestError"];
                401: external$2["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                403: external$2["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                429: external$2["swagger.yml"]["components"]["responses"]["RateLimitError"];
                500: external$2["swagger.yml"]["components"]["responses"]["InternalServerError"];
            };
            requestBody: {
                content: {
                    "application/json": {
                        quirkId: string;
                        /** Format: uuid */
                        projectId: string;
                    };
                };
            };
        };
        /** Handles preflight requests. This endpoint allows CORS. */
        options: {
            responses: {
                /** OK */
                204: never;
            };
        };
    };
}
interface components$2 {
    schemas: {
        Quirk: {
            id: string;
            name: string;
            description?: string | null;
            options?: components$2["schemas"]["QuirkOptions"][];
            source?: components$2["schemas"]["QuirkSource"];
        };
        QuirkOptions: {
            name: string;
            value: string;
        };
        /** @description The source of this quirk. When not defined, it is user specified. */
        QuirkSource: {
            name: string;
            id: string;
        };
    };
}
interface external$2 {
    "swagger.yml": {
        paths: {};
        components: {
            schemas: {
                Error: {
                    /** @description Error message(s) that occurred while processing the request */
                    errorMessage?: string[] | string;
                };
            };
            responses: {
                /** Request input validation failed */
                BadRequestError: {
                    content: {
                        "application/json": external$2["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** API key or token was not valid */
                UnauthorizedError: {
                    content: {
                        "application/json": external$2["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Permission was denied */
                ForbiddenError: {
                    content: {
                        "application/json": external$2["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Resource not found */
                NotFoundError: {
                    content: {
                        "application/json": external$2["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Too many requests in allowed time period */
                RateLimitError: unknown;
                /** Execution error occurred */
                InternalServerError: unknown;
            };
        };
        operations: {};
    };
}

/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */
interface paths$1 {
    "/api/v2/signal": {
        get: {
            parameters: {
                query: {
                    /** The project to fetch signals for */
                    projectId: string;
                    /** Limit the results to a specific signal ID */
                    signalId?: string;
                };
            };
            responses: {
                /** OK */
                200: {
                    content: {
                        "application/json": {
                            signals: components$1["schemas"]["SignalWithId"][];
                        };
                    };
                };
                400: external$1["swagger.yml"]["components"]["responses"]["BadRequestError"];
                401: external$1["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                403: external$1["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                429: external$1["swagger.yml"]["components"]["responses"]["RateLimitError"];
                500: external$1["swagger.yml"]["components"]["responses"]["InternalServerError"];
            };
        };
        put: {
            responses: {
                /** OK */
                204: never;
                400: external$1["swagger.yml"]["components"]["responses"]["BadRequestError"];
                401: external$1["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                403: external$1["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                429: external$1["swagger.yml"]["components"]["responses"]["RateLimitError"];
                500: external$1["swagger.yml"]["components"]["responses"]["InternalServerError"];
            };
            requestBody: {
                content: {
                    "application/json": {
                        signal: components$1["schemas"]["SignalWithId"];
                        /** Format: uuid */
                        projectId: string;
                    };
                };
            };
        };
        delete: {
            responses: {
                /** OK */
                204: never;
                400: external$1["swagger.yml"]["components"]["responses"]["BadRequestError"];
                401: external$1["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                403: external$1["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                429: external$1["swagger.yml"]["components"]["responses"]["RateLimitError"];
                500: external$1["swagger.yml"]["components"]["responses"]["InternalServerError"];
            };
            requestBody: {
                content: {
                    "application/json": {
                        signalId: string;
                        /** Format: uuid */
                        projectId: string;
                    };
                };
            };
        };
        /** Handles preflight requests. This endpoint allows CORS. */
        options: {
            responses: {
                /** OK */
                204: never;
            };
        };
    };
}
interface components$1 {
    schemas: {
        SignalWithId: {
            id: string;
        } & external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["PreviewSignal"];
    };
}
interface external$1 {
    "swagger.yml": {
        paths: {};
        components: {
            schemas: {
                Error: {
                    /** @description Error message(s) that occurred while processing the request */
                    errorMessage?: string[] | string;
                };
            };
            responses: {
                /** Request input validation failed */
                BadRequestError: {
                    content: {
                        "application/json": external$1["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** API key or token was not valid */
                UnauthorizedError: {
                    content: {
                        "application/json": external$1["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Permission was denied */
                ForbiddenError: {
                    content: {
                        "application/json": external$1["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Resource not found */
                NotFoundError: {
                    content: {
                        "application/json": external$1["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Too many requests in allowed time period */
                RateLimitError: unknown;
                /** Execution error occurred */
                InternalServerError: unknown;
            };
        };
        operations: {};
    };
    "uniform-context-types.swagger.yml": {
        paths: {};
        components: {
            schemas: {
                EnrichmentCategory: {
                    /** @description The maximum visitor score allowed for enrichment keys in this category */
                    cap: number;
                };
                PreviewSignal: external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["Signal"] & {
                    /** @description Friendly name of the signal */
                    name: string;
                    /** @description Description of the signal */
                    description?: string;
                };
                Signal: {
                    /** @description The signal strength per activation (each time its criteria are true, this score is added) */
                    str: number;
                    /** @description The maximum visitor score allowed for this signal */
                    cap: number;
                    /**
                     * @description How long the signal's score should persist
                     * 's' = current session (expires after a period of inactivity)
                     * 'p' = permanent (expires as far in the future as possible, may be limited by browser security settings)
                     * 't' = transient (score tracks the current state of the criteria every time scores are updated)
                     *
                     * @enum {string}
                     */
                    dur: "s" | "p" | "t";
                    crit: external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["RootSignalCriteriaGroup"];
                };
                RootSignalCriteriaGroup: {
                    /**
                     * @description Criteria type (Group of other criteria)
                     * @enum {string}
                     */
                    type: "G";
                    /**
                     * @description The logical operator to apply to the criteria groups
                     * & = AND
                     * | = OR
                     *
                     * Default is `&` if unspecified.
                     *
                     * @default &
                     * @enum {string}
                     */
                    op?: "&" | "|";
                    /** @description The criteria clauses that make up this grouping of criteria */
                    clauses: (external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["SignalCriteriaGroup"] | external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["SignalCriteria"])[];
                };
                SignalCriteriaGroup: {
                    /**
                     * @description Criteria type (Group of other criteria)
                     * @enum {string}
                     */
                    type: "G";
                    /**
                     * @description The logical operator to apply to the criteria groups
                     * & = AND
                     * | = OR
                     *
                     * Default is `&` if unspecified.
                     *
                     * @enum {string}
                     */
                    op?: "&" | "|";
                    /** @description The criteria clauses that make up this grouping of criteria */
                    clauses: (external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["SignalCriteriaGroup"] | external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["SignalCriteria"])[];
                };
                SignalCriteria: external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["CookieCriteria"] | external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["QueryStringCriteria"] | external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["QuirkCriteria"] | external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["EventCriteria"] | external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["CurrentPageCriteria"] | external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["PageViewCountCriteria"];
                /** @description Matches a URL query string parameter value */
                QueryStringCriteria: {
                    /** @enum {string} */
                    type: "QS";
                    /** @description The name of the query string parameter to match */
                    queryName: string;
                    /** @description The value to match the query string parameter against */
                    match: external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["StringMatch"];
                };
                /** @description Matches a web cookie value */
                CookieCriteria: {
                    /** @enum {string} */
                    type: "CK";
                    /** @description The name of the cookie to match */
                    cookieName: string;
                    /** @description The value to match the cookie against */
                    match: external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["StringMatch"];
                };
                /** @description Matches a visitor quirk key and value */
                QuirkCriteria: {
                    /** @enum {string} */
                    type: "QK";
                    /** @description The name of the quirk key to match */
                    key: string;
                    /** @description The quirk value to match against */
                    match: external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["StringMatch"];
                };
                /** @description Matches an analytics event name being fired */
                EventCriteria: {
                    /** @enum {string} */
                    type: "EVT";
                    /** @description How to match the event name */
                    event: external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["StringMatch"];
                };
                /**
                 * @description Matches the current page's absolute path (i.e. /path/to/page.html)
                 * Does not include the query string or protocol and hostname (i.e. NOT https://foo.com/path/to/page.html?query=something)
                 */
                CurrentPageCriteria: {
                    /** @enum {string} */
                    type: "PV";
                    /** @description The page/route path to match as a page that has been visited */
                    path: external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["StringMatch"];
                };
                PageViewCountCriteria: {
                    /** @enum {string} */
                    type: "PVC";
                    /** @description The expression to match the page view count against */
                    match: external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["NumberMatch"];
                };
                /** @description Describes a match expression on a string */
                StringMatch: {
                    /** @description The right hand side of the match expression */
                    rhs: string;
                    /**
                     * @description The match operator
                     * '=' = exact match
                     * '~' = contains match
                     * '//' = regular expression match
                     *
                     * Any of the above can be prefixed with '!' to invert the match (i.e. != for 'not an exact match')
                     *
                     * @enum {string}
                     */
                    op: "=" | "~" | "//" | "!=" | "!~" | "!//";
                    /** @description The case sensitivity of the match. Defaults to false if unspecified. */
                    cs?: boolean;
                } | {
                    /**
                     * @description The type of match to perform
                     * '*' = exists with any value
                     * '!*' = does not exist
                     *
                     * @enum {string}
                     */
                    op: "*" | "!*";
                };
                /** @description Describes a match expression on a number */
                NumberMatch: {
                    /** @description The right hand side of the match expression */
                    rhs: number;
                    /**
                     * @description The type of match to perform
                     * '=' = exact match
                     * '!=' = not an exact match
                     * '<' = less than match expression
                     * '>' = greater than match expression
                     *
                     * @enum {string}
                     */
                    op: "=" | "<" | ">" | "!=";
                };
                /** @description Defines an aggregate dimension that is a grouping of other dimensions' scores; an intent or audience. */
                AggregateDimension: {
                    /** @description Input dimensions to the aggregate dimension */
                    inputs: external$1["uniform-context-types.swagger.yml"]["components"]["schemas"]["AggregateDimensionInput"][];
                };
                /** @description Defines an input dimension to an aggregate dimension */
                AggregateDimensionInput: {
                    /**
                     * @description Dimension name to reference as an input.
                     * For enrichment inputs, use CATEGORY_KEY as the dimension.
                     * Enrichments, signals, and other aggregate dimensions may be referenced.
                     *
                     * Note that creating a cycle of aggregate dimensions is allowed, however
                     * the final score will _ignore_ the cycled aggregate dimension in the result.
                     * This can be used to create mutually exclusive aggregates.
                     */
                    dim: string;
                    /**
                     * @description The sign of the input dimension controls how it affects the aggregate dimension's final score.
                     *
                     * '+' = add to the final score
                     * '-' = subtract from the final score
                     * 'c' = clear the final score (if the input dimension has any score at all, this aggreate will have no score regardless of other inputs)
                     *
                     * Default if unspecified: '+'
                     *
                     * @default +
                     * @enum {string}
                     */
                    sign?: "+" | "-" | "c";
                };
                Test: {
                    /** @description Winning variation ID - if set, the test will not run and this variation is shown to all visitors (the test is closed) */
                    wv?: string;
                };
            };
        };
        operations: {};
    };
}

/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */
interface paths {
    "/api/v2/test": {
        /** Gets A/B test definitions for a project */
        get: {
            parameters: {
                query: {
                    /** The project to fetch tests for */
                    projectId: string;
                    /** Limit the results to a specific test public ID */
                    testId?: string;
                };
            };
            responses: {
                /** OK */
                200: {
                    content: {
                        "application/json": {
                            tests: components["schemas"]["Test"][];
                        };
                    };
                };
                400: external["swagger.yml"]["components"]["responses"]["BadRequestError"];
                401: external["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                403: external["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                429: external["swagger.yml"]["components"]["responses"]["RateLimitError"];
                500: external["swagger.yml"]["components"]["responses"]["InternalServerError"];
            };
        };
        put: {
            responses: {
                /** OK */
                204: never;
                400: external["swagger.yml"]["components"]["responses"]["BadRequestError"];
                401: external["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                403: external["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                429: external["swagger.yml"]["components"]["responses"]["RateLimitError"];
                500: external["swagger.yml"]["components"]["responses"]["InternalServerError"];
            };
            requestBody: {
                content: {
                    "application/json": {
                        test: components["schemas"]["Test"];
                        /** Format: uuid */
                        projectId: string;
                    };
                };
            };
        };
        delete: {
            responses: {
                /** OK */
                204: never;
                400: external["swagger.yml"]["components"]["responses"]["BadRequestError"];
                401: external["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                403: external["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                429: external["swagger.yml"]["components"]["responses"]["RateLimitError"];
                500: external["swagger.yml"]["components"]["responses"]["InternalServerError"];
            };
            requestBody: {
                content: {
                    "application/json": {
                        testId: string;
                        /** Format: uuid */
                        projectId: string;
                    };
                };
            };
        };
        /** Handles preflight requests. This endpoint allows CORS. */
        options: {
            responses: {
                /** OK */
                204: never;
            };
        };
    };
}
interface components {
    schemas: {
        Test: {
            id: string;
            name: string;
            winning_variant_id?: string;
            default_variant_id?: string;
            /** @default false */
            closed?: boolean;
        };
    };
}
interface external {
    "swagger.yml": {
        paths: {};
        components: {
            schemas: {
                Error: {
                    /** @description Error message(s) that occurred while processing the request */
                    errorMessage?: string[] | string;
                };
            };
            responses: {
                /** Request input validation failed */
                BadRequestError: {
                    content: {
                        "application/json": external["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** API key or token was not valid */
                UnauthorizedError: {
                    content: {
                        "application/json": external["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Permission was denied */
                ForbiddenError: {
                    content: {
                        "application/json": external["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Resource not found */
                NotFoundError: {
                    content: {
                        "application/json": external["swagger.yml"]["components"]["schemas"]["Error"];
                    };
                };
                /** Too many requests in allowed time period */
                RateLimitError: unknown;
                /** Execution error occurred */
                InternalServerError: unknown;
            };
        };
        operations: {};
    };
}

type EnrichmentGet = paths$5['/api/v1/enrichments']['get'];
type EnrichmentGetParameters = EnrichmentGet['parameters']['query'];
type EnrichmentGetResponse = EnrichmentGet['responses']['200']['content']['application/json'];
type EnrichmentCategory = components$5['schemas']['EnrichmentCategory'];
type EnrichmentCategoryWithValues = components$5['schemas']['EnrichmentCategoryWithValues'];
type EnrichmentValue = components$5['schemas']['EnrichmentValue'];
type EnrichmentPut = paths$5['/api/v1/enrichments']['put'];
type EnrichmentPutParameters = EnrichmentPut['requestBody']['content']['application/json'];
type EnrichmentDelete = paths$5['/api/v1/enrichments']['delete'];
type EnrichmentDeleteParameters = EnrichmentDelete['requestBody']['content']['application/json'];
type EnrichmentValuePut = paths$6['/api/v1/enrichment-values']['put'];
type EnrichmentValuePutParameters = EnrichmentValuePut['requestBody']['content']['application/json'];
type EnrichmentValueDelete = paths$6['/api/v1/enrichment-values']['delete'];
type EnrichmentValueDeleteParameters = EnrichmentValueDelete['requestBody']['content']['application/json'];
type ManifestGet = paths$7['/api/v2/manifest']['get'];
type ManifestGetParameters = ManifestGet['parameters']['query'];
type ManifestGetResponse = ManifestGet['responses']['200']['content']['application/json'];
type AggregateGet = paths$4['/api/v2/aggregate']['get'];
type AggregateGetParameters = AggregateGet['parameters']['query'];
type AggregateGetResponse = AggregateGet['responses']['200']['content']['application/json'];
type Aggregate = components$4['schemas']['AggregateData'];
type AggregatePut = paths$4['/api/v2/aggregate']['put'];
type AggregatePutParameters = AggregatePut['requestBody']['content']['application/json'];
type AggregateDelete = paths$4['/api/v2/aggregate']['delete'];
type AggregateDeleteParameters = AggregateDelete['requestBody']['content']['application/json'];
type DimensionGet = paths$3['/api/v2/dimension']['get'];
type DimensionGetParameters = DimensionGet['parameters']['query'];
type DimensionGetResponse = DimensionGet['responses']['200']['content']['application/json'];
type DimensionDefinition = components$3['schemas']['DimensionDefinition'];
type QuirkGet = paths$2['/api/v2/quirk']['get'];
type QuirkGetParameters = QuirkGet['parameters']['query'];
type QuirkGetResponse = QuirkGet['responses']['200']['content']['application/json'];
type Quirk = components$2['schemas']['Quirk'];
type QuirkPut = paths$2['/api/v2/quirk']['put'];
type QuirkPutParameters = QuirkPut['requestBody']['content']['application/json'];
type QuirkDelete = paths$2['/api/v2/quirk']['delete'];
type QuirkDeleteParameters = QuirkDelete['requestBody']['content']['application/json'];
type TestGet = paths['/api/v2/test']['get'];
type TestGetParameters = TestGet['parameters']['query'];
type TestGetResponse = TestGet['responses']['200']['content']['application/json'];
type Test = components['schemas']['Test'];
type TestPut = paths['/api/v2/test']['put'];
type TestPutParameters = TestPut['requestBody']['content']['application/json'];
type TestDelete = paths['/api/v2/test']['delete'];
type TestDeleteParameters = TestDelete['requestBody']['content']['application/json'];
type SignalGet = paths$1['/api/v2/signal']['get'];
type SignalGetParameters = SignalGet['parameters']['query'];
type SignalGetResponse = SignalGet['responses']['200']['content']['application/json'];
type SignalWithId = components$1['schemas']['SignalWithId'];
type RootSignalCriteriaGroup = components$6['schemas']['RootSignalCriteriaGroup'];
type CookieCriteria = components$6['schemas']['CookieCriteria'];
type QueryStringCriteria = components$6['schemas']['QueryStringCriteria'];
type QuirkCriteria = components$6['schemas']['QuirkCriteria'];
type EventCriteria = components$6['schemas']['EventCriteria'];
type CurrentPageCriteria = components$6['schemas']['CurrentPageCriteria'];
type PageViewCountCriteria = components$6['schemas']['PageViewCountCriteria'];
type SignalPut = paths$1['/api/v2/signal']['put'];
type SignalPutParameters = SignalPut['requestBody']['content']['application/json'];
type SignalDelete = paths$1['/api/v2/signal']['delete'];
type SignalDeleteParameters = SignalDelete['requestBody']['content']['application/json'];
type ContextDefinitions = {
    aggregates?: Array<Aggregate>;
    quirks?: Array<Quirk>;
    signals?: Array<SignalWithId>;
    enrichments?: Array<EnrichmentCategoryWithValues>;
    tests?: Array<Test>;
};

declare class AggregateClient extends ApiClient {
    #private;
    constructor(options: ClientOptions);
    /** Fetches all aggregates for a project */
    get(options?: ExceptProject<AggregateGetParameters>): Promise<AggregateGetResponse>;
    /** Updates or creates (based on id) an Aggregate */
    upsert(body: ExceptProject<AggregatePutParameters>): Promise<void>;
    /** Deletes an Aggregate */
    remove(body: ExceptProject<AggregateDeleteParameters>): Promise<void>;
}
declare class UncachedAggregateClient extends AggregateClient {
    constructor(options: Omit<ClientOptions, 'bypassCache'>);
}
declare class CachedAggregateClient extends AggregateClient {
    constructor(options: Omit<ClientOptions, 'bypassCache'>);
}

type DimensionDisplayData = {
    dim: string;
    type: 'Aggregate' | 'Enrichment' | 'Signal' | 'Intent' | 'Audience';
    category?: string;
    name: string;
};
declare function computeDimensionDefinitionDisplayData(dim: DimensionDefinition): DimensionDisplayData;
declare function computeDimensionDisplayData(dim: string, manifest: ManifestV2): DimensionDisplayData | undefined;
/** Computes the standard display name for a given dimension from the dimensions API */
declare function computeDimensionDisplayName(dim: DimensionDefinition): string;

declare class DimensionClient extends ApiClient {
    #private;
    constructor(options: ClientOptions);
    /** Fetches the known score dimensions for a project */
    get(options?: ExceptProject<DimensionGetParameters>): Promise<DimensionGetResponse>;
}
declare class UncachedDimensionClient extends DimensionClient {
    constructor(options: Omit<ClientOptions, 'bypassCache'>);
}
declare class CachedDimensionClient extends DimensionClient {
    constructor(options: Omit<ClientOptions, 'bypassCache'>);
}

declare class EnrichmentClient extends ApiClient {
    #private;
    constructor(options: ClientOptions);
    /** Fetches all enrichments and values for a project, grouped by category */
    get(options?: ExceptProject<EnrichmentGetParameters>): Promise<EnrichmentGetResponse>;
    /** Updates or creates (based on id) an enrichment category */
    upsertCategory(body: ExceptProject<EnrichmentPutParameters>): Promise<void>;
    /** Deletes an enrichment category */
    removeCategory(body: ExceptProject<EnrichmentDeleteParameters>): Promise<void>;
    /** Updates or creates (based on id) an enrichment value within an enrichment category */
    upsertValue(body: ExceptProject<EnrichmentValuePutParameters>): Promise<void>;
    /** Deletes an enrichment value within an enrichment category. The category is left alone. */
    removeValue(body: ExceptProject<EnrichmentValueDeleteParameters>): Promise<void>;
}
declare class UncachedEnrichmentClient extends EnrichmentClient {
    constructor(options: Omit<ClientOptions, 'bypassCache'>);
}
declare class CachedEnrichmentClient extends EnrichmentClient {
    constructor(options: Omit<ClientOptions, 'bypassCache'>);
}

declare class ManifestClient extends ApiClient {
    #private;
    constructor(options: ClientOptions);
    /** Fetches the Context manifest for a project */
    get(options?: ExceptProject<ManifestGetParameters>): Promise<ManifestGetResponse>;
    /** Publishes the Context manifest for a project */
    publish(): Promise<void>;
}
declare class UncachedManifestClient extends ManifestClient {
    constructor(options: Omit<ClientOptions, 'bypassCache'>);
}
declare class CachedManifestClient extends ManifestClient {
    constructor(options: Omit<ClientOptions, 'bypassCache'>);
}

declare class QuirkClient extends ApiClient {
    #private;
    constructor(options: ClientOptions);
    /** Fetches all Quirks for a project */
    get(options?: ExceptProject<QuirkGetParameters>): Promise<QuirkGetResponse>;
    /** Updates or creates (based on id) a Quirk */
    upsert(body: ExceptProject<QuirkPutParameters>): Promise<void>;
    /** Deletes a Quirk */
    remove(body: ExceptProject<QuirkDeleteParameters>): Promise<void>;
}
declare class UncachedQuirkClient extends QuirkClient {
    constructor(options: Omit<ClientOptions, 'bypassCache'>);
}
declare class CachedQuirkClient extends QuirkClient {
    constructor(options: Omit<ClientOptions, 'bypassCache'>);
}

declare class SignalClient extends ApiClient {
    #private;
    constructor(options: ClientOptions);
    /** Fetches all Signals for a project */
    get(options?: ExceptProject<SignalGetParameters>): Promise<SignalGetResponse>;
    /** Updates or creates (based on id) a Signal */
    upsert(body: ExceptProject<SignalPutParameters>): Promise<void>;
    /** Deletes a Signal */
    remove(body: ExceptProject<SignalDeleteParameters>): Promise<void>;
}
declare class UncachedSignalClient extends SignalClient {
    constructor(options: Omit<ClientOptions, 'bypassCache'>);
}
declare class CachedSignalClient extends SignalClient {
    constructor(options: Omit<ClientOptions, 'bypassCache'>);
}

declare class TestClient extends ApiClient {
    #private;
    constructor(options: ClientOptions);
    /** Fetches all Tests for a project */
    get(options?: ExceptProject<TestGetParameters>): Promise<TestGetResponse>;
    /** Updates or creates (based on id) a Test */
    upsert(body: ExceptProject<TestPutParameters>): Promise<void>;
    /** Deletes a Test */
    remove(body: ExceptProject<TestDeleteParameters>): Promise<void>;
}
declare class UncachedTestClient extends TestClient {
    constructor(options: Omit<ClientOptions, 'bypassCache'>);
}
declare class CachedTestClient extends TestClient {
    constructor(options: Omit<ClientOptions, 'bypassCache'>);
}

declare class ContextClient {
    constructor(options: ClientOptions);
    readonly enrichments: EnrichmentClient;
    readonly aggregates: AggregateClient;
    readonly dimensions: DimensionClient;
    readonly manifest: ManifestClient;
    readonly quirks: QuirkClient;
    readonly signals: SignalClient;
    readonly tests: TestClient;
}
declare class UncachedContextClient extends ContextClient {
    constructor(options: Omit<ClientOptions, 'bypassCache'>);
}
declare class CachedContextClient extends ContextClient {
    constructor(options: Omit<ClientOptions, 'bypassCache'>);
}

export { type Aggregate, AggregateClient, type AggregateDeleteParameters, type AggregateGetParameters, type AggregateGetResponse, type AggregatePutParameters, ApiClient, ApiClientError, CachedAggregateClient, CachedContextClient, CachedDimensionClient, CachedEnrichmentClient, CachedManifestClient, CachedQuirkClient, CachedSignalClient, CachedTestClient, type ClientOptions, ContextClient, type ContextDefinitions, type CookieCriteria, type CurrentPageCriteria, DimensionClient, type DimensionDefinition, type DimensionDisplayData, type DimensionGetParameters, type DimensionGetResponse, type EnrichmentCategory, type EnrichmentCategoryWithValues, EnrichmentClient, type EnrichmentDeleteParameters, type EnrichmentGetParameters, type EnrichmentGetResponse, type EnrichmentPutParameters, type EnrichmentValue, type EnrichmentValueDeleteParameters, type EnrichmentValuePutParameters, type EventCriteria, type ExceptProject, type LimitPolicy, ManifestClient, type ManifestGetParameters, type ManifestGetResponse, type PageViewCountCriteria, type QueryStringCriteria, type Quirk, QuirkClient, type QuirkCriteria, type QuirkDeleteParameters, type QuirkGetParameters, type QuirkGetResponse, type QuirkPutParameters, type RootSignalCriteriaGroup, SignalClient, type SignalDeleteParameters, type SignalGetParameters, type SignalGetResponse, type SignalPutParameters, type SignalWithId, type Test, TestClient, type TestDeleteParameters, type TestGetParameters, type TestGetResponse, type TestPutParameters, UncachedAggregateClient, UncachedContextClient, UncachedDimensionClient, UncachedEnrichmentClient, UncachedManifestClient, UncachedQuirkClient, UncachedSignalClient, UncachedTestClient, computeDimensionDefinitionDisplayData, computeDimensionDisplayData, computeDimensionDisplayName, defaultLimitPolicy, handleRateLimits, nullLimitPolicy };
