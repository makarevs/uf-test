import * as mitt from 'mitt';

type Quirks = {
    [key: string]: string;
};
type Tests = {
    [key: string]: string;
};
type ScoreVector = {
    [key: string]: number;
};
type EnrichmentData = {
    /** Enrichment category name */
    cat: string;
    /** Enrichment key value */
    key: string;
    /** Strength value (amount of score added when viewing content) */
    str: number;
};
/** An event that has occurred (i.e. an analytics track) which may trigger an Event signal */
type EventData = {
    /** The event name that has been fired */
    event: string;
};
type VisitorData = {
    /**
     * Quirk key-value data.
     * NOTE: Context.quirks is more commonly correct if you need to read quirks data.
     */
    quirks: Quirks;
    /** A/B test variant selections */
    tests: Tests;
    /**
     * Personalization score data for the current session (merge with all time for totals)
     * NOTE: Context.scores is more commonly correct to read scores instead of this value.
     */
    sessionScores: ScoreVector;
    /**
     * Personalization score data for all time (merge with session for totals)
     * NOTE: Context.scores is more commonly correct to read scores instead of this value.
     */
    scores: ScoreVector;
    /**
     * Whether consent has been given to store the visitor data
     * If false or not set: visitor data is stored in memory and is lost if the browser refreshes
     * If true: visitor data is stored in localStorage and any other transition storage if registered
     */
    consent?: boolean;
    /**
     * Whether the visitor has been assigned to the personalization control group -
     * visitors who are not shown personalization. If this is true, all scores will be zeroed,
     * and score updates will be ignored. This has no effect on quirks or tests.
     *
     * If this value is not set, a random roll will be performed to determine membership,
     * based on the control group size.
     */
    controlGroup?: boolean;
};
declare const emptyVisitorData: () => VisitorData;
/**
 * Expresses a 'patch' to the Uniform Context state
 */
type ContextState = {
    cookies: Record<string, string>;
    url?: URL;
    quirks: Quirks;
    enrichments: EnrichmentData[];
    events: EventData[];
};
type ContextStateUpdate = {
    state: Partial<ContextState>;
    previousState: Partial<ContextState>;
    visitor: VisitorData;
    scores: ScoreVector;
};

type StorageCommand<TID extends string = string, TData = unknown> = {
    type: TID;
    data: TData;
};
/** Commands that can be issued to alter the storage of Uniform Context data */
type StorageCommands = ModifyScoreCommand | ModifySessionScoreCommand | SetConsentCommand | SetQuirkCommand | SetTestCommand | IdentifyCommand | SetControlGroupCommand;
/**
 * Changes the visitor's permanent score for a given dimension
 */
type ModifyScoreCommand = StorageCommand<'modscore', {
    dimension: string;
    delta: number;
}>;
/**
 * Changes the visitor's session (time-based) score for a given dimension
 */
type ModifySessionScoreCommand = StorageCommand<'modscoreS', {
    dimension: string;
    delta: number;
}>;
/**
 * Changes the visitor's storage consent setting.
 * Setting consent to false will trigger deletion of any stored data for the visitor.
 * Scores are still collected in-memory when consent is false; just not persisted.
 */
type SetConsentCommand = StorageCommand<'consent', boolean>;
/** Sets a permanent quirk key and value for the visitor */
type SetQuirkCommand = StorageCommand<'setquirk', {
    key: string;
    value: string;
}>;
/** Sets a specific variant as being this visitor's variant on an A/B test */
type SetTestCommand = StorageCommand<'settest', {
    test: string;
    variant: string;
}>;
/**
 * Identifies the visitor as being a specific unique identifier.
 * NOTE: this only has an effect when using an external cross-device transition storage system.
 * NOTE: you cannot read the identified visitor ID back from the storage system once it is set.
 */
type IdentifyCommand = StorageCommand<'identify', {
    identity: string;
}>;
/**
 * Sets whether the current visitor is in the personalization control group
 * (Will not be exposed to personalization or gather classification data; WILL see A/B tests)
 * In most cases this should not be sent as the membership is computed automatically for visitors;
 * this command is intended mostly for diagnostics and testing purposes.
 */
type SetControlGroupCommand = StorageCommand<'setcontrol', boolean>;

type TransitionDataStoreOptions = {
    initialData?: Partial<VisitorData>;
};
type ServerToClientTransitionState = Pick<Partial<VisitorData>, 'quirks' | 'tests'> & {
    /**
     * Server Score Vector - the resultant scores _on the server side_ after the server/edge render completes
     * Note that the client side does not trust these scores; they are only used until it's done with initial
     * recomputation.
     */
    ssv?: ScoreVector;
};
declare const SERVER_STATE_ID = "__UNIFORM_DATA__";
type TransitionDataStoreEvents = {
    /**
     * Fired when the data is updated asynchronously
     * (i.e. a promise resolves with new data from a backend)
     *
     * NOT fired for synchronous updates (e.g. calling updateData()), unless this also results in an async update of the data afterwards.
     * NOT fired if an asynchronous update does not result in any change compared to the last known data.
     */
    dataUpdatedAsync: Partial<VisitorData>;
};
declare abstract class TransitionDataStore {
    #private;
    constructor({ initialData }: TransitionDataStoreOptions);
    get data(): Partial<VisitorData> | undefined;
    get initialData(): Partial<VisitorData> | undefined;
    /**
     * Subscribe to events from the transition storage
     */
    readonly events: {
        on: {
            <Key extends "dataUpdatedAsync">(type: Key, handler: mitt.Handler<TransitionDataStoreEvents[Key]>): void;
            (type: "*", handler: mitt.WildcardHandler<TransitionDataStoreEvents>): void;
        };
        off: {
            <Key_1 extends "dataUpdatedAsync">(type: Key_1, handler?: mitt.Handler<TransitionDataStoreEvents[Key_1]> | undefined): void;
            (type: "*", handler: mitt.WildcardHandler<TransitionDataStoreEvents>): void;
        };
    };
    /**
     * Updates data in the transition storage.
     * @param commands Commands to execute against existing stored value (event based stores)
     * @param computedValue Pre-computed new value against existing value (object based stores)
     * @returns Resolved promise when the data has been updated
     */
    updateData(commands: StorageCommands[], computedValue: VisitorData): Promise<void>;
    /**
     * Deletes a visitor's stored data, forgetting them.
     * @param fromAllDevices - false: logout from this device ID. true: forget all data about the visitor and their identity.
     */
    delete(fromAllDevices?: boolean): Promise<void>;
    /**
     * Deletes a visitor's stored data, forgetting them.
     * Important: do not emit any async score update events from this function.
     * @param fromAllDevices - false: logout from this device ID. true: forget all data about the visitor and their identity.
     */
    abstract handleDelete(fromAllDevices?: boolean): Promise<void>;
    /**
     * Updates visitor data in the transition store.
     *
     * NOTE: The updated data is optimistically stored in TransitionDataStore automatically,
     * so unless the updated data is _changed_ by the backend data store, there is no need
     * to emit async score changed events when the visitor data is done updating.
     */
    abstract handleUpdateData(commands: StorageCommands[], computedValue: VisitorData): Promise<void>;
    protected signalAsyncDataUpdate(newScores: Partial<VisitorData>): void;
    /**
     * When we load on the client side after a server side rendering has occurred (server to client transition),
     * we can have a page script (ID: __UNIFORM_DATA__) that contains the computed visitor data from the SSR/edge render.
     * This data is injected into the first render to allow score syncing and the server to request commands be applied
     * to the client side data store.
     */
    getClientTransitionState(): ServerToClientTransitionState | undefined;
}

type DecayOptions = {
    now: number;
    lastUpd: number | undefined;
    scores: ScoreVector;
    sessionScores: ScoreVector;
    onLogMessage?: (message: LogMessage) => void;
};
/**
 * Computes decay of visitor scores over time.
 * NOTE: it is expected that this function mutates the incoming score vectors,
 * if it needs to apply score decay. The data store ensures immutability already.
 *
 * @returns true if any decay was applied, false otherwise
 */
type DecayFunction = (options: DecayOptions) => boolean;

type VisitorDataStoreOptions = {
    /** Transition storage used to transfer server or edge side execution state to the client. Unused for client side only. */
    transitionStore?: TransitionDataStore;
    /** Duration of a 'visit' measured by this number of milliseconds without performing any updates */
    visitLifespan?: number;
    /** Personalization manifest data. If set, the data store will automatically apply score caps in the manifest data. */
    manifest?: ManifestInstance;
    /** Allows decaying of scores over time based on time between visits. Default: no decay */
    decay?: DecayFunction;
    /**
     * Sets the default value of storage consent for new unknown visitors.
     * If storage consent is not given, only in-memory data will be stored which is lost when the browser leaves the page.
     * @default false - consent is not given for new visitors until they explicitly give it with an update command
     */
    defaultConsent?: boolean;
    /**
     * Function called when server-to-client transfer state is loaded and contains server-side computed scores.
     * These scores are used as a temporary shim for the current scores on the client side, until score computation
     * is completed the first time (which occurs when the current url is fed into the Context).
     *
     * Because the feed of the URL may be marginally delayed (for example in React it's in an effect so it's a second render),
     * one render might be done with _no_ scores unless we dropped the server scores in temporarily, resulting in a flash of unpersonalized content.
     */
    onServerTransitionReceived?: (state: ServerToClientTransitionState) => void;
    /** Called when a log message is emitted from the data store */
    onLogMessage?: (message: LogMessage) => void;
};
type VisitorDataStoreEvents = {
    /**
     * Fired when the stored data is updated.
     * This is fired for any update, whether from integrated or transition storage.
     * The event is NOT fired if an update does not result in any score changes.
     */
    scoresUpdated: Pick<VisitorData, 'scores' | 'sessionScores'>;
    /**
     * Fired when stored quirks are updated.
     * This is fired for any update, whether from integrated or transition storage.
     * The event is NOT fired if an update does not result in any quirk changes.
     */
    quirksUpdated: Pick<VisitorData, 'quirks'>;
    /**
     * Fired when test variant selection is updated.
     */
    testsUpdated: Pick<VisitorData, 'tests'>;
    /**
     * Fired when storage consent is changed
     */
    consentUpdated: Pick<VisitorData, 'consent'>;
    /**
     * Fired when visitor control group membership is changed
     */
    controlGroupUpdated: Pick<VisitorData, 'controlGroup'>;
};
declare class VisitorDataStore {
    #private;
    constructor(options: VisitorDataStoreOptions);
    /** Gets the current visitor data. This property is always up to date. */
    get data(): VisitorData;
    get decayEnabled(): boolean;
    get options(): VisitorDataStoreOptions;
    /**
     * Subscribe to events from storage
     */
    readonly events: {
        on: {
            <Key extends keyof VisitorDataStoreEvents>(type: Key, handler: mitt.Handler<VisitorDataStoreEvents[Key]>): void;
            (type: "*", handler: mitt.WildcardHandler<VisitorDataStoreEvents>): void;
        };
        off: {
            <Key_1 extends keyof VisitorDataStoreEvents>(type: Key_1, handler?: mitt.Handler<VisitorDataStoreEvents[Key_1]> | undefined): void;
            (type: "*", handler: mitt.WildcardHandler<VisitorDataStoreEvents>): void;
        };
    };
    /** Push data update command(s) into the visitor data */
    updateData(commands: StorageCommands[]): Promise<void>;
    /**
     * Deletes visitor data (forgetting them)
     * In most cases you should use forget() on the Context instead of this function, which also clears the Context state.
     * @param fromAllDevices for an identified user, whether to delete all their data (for the entire account) - true, or data for this device (sign out) - false
     */
    delete(fromAllDevices: boolean): Promise<void>;
}

declare class ManifestInstance {
    #private;
    readonly data: ManifestV2;
    constructor({ manifest, evaluator, onLogMessage, }: {
        manifest: ManifestV2;
        evaluator?: GroupCriteriaEvaluator;
        onLogMessage?: (message: LogMessage) => void;
    });
    rollForControlGroup(): boolean;
    getTest(name: string): TestDefinition | undefined;
    computeSignals(update: ContextStateUpdate): StorageCommands[];
    /**
     * Computes aggregated scores based on other dimensions
     */
    computeAggregateDimensions(primitiveScores: ScoreVector): ScoreVector;
    getDimensionByKey(scoreKey: string): EnrichmentCategory | Signal | undefined;
}

/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */
interface paths {
    "/api/v2/manifest": {
        /**
         * Fetches the Intent Manifest for a given project.
         * If no manifest has ever been published, and an API key is used that has preview manifest permissions then the current preview manifest will be returned (in delivery format).
         */
        get: {
            parameters: {
                query: {
                    preview?: boolean;
                    projectId: string;
                };
            };
            responses: {
                /** OK */
                200: {
                    content: {
                        "application/json": components["schemas"]["ManifestV2"];
                    };
                };
                400: external["swagger.yml"]["components"]["responses"]["BadRequestError"];
                401: external["swagger.yml"]["components"]["responses"]["UnauthorizedError"];
                403: external["swagger.yml"]["components"]["responses"]["ForbiddenError"];
                /** No manifest has ever been published, and the API key does not have preview permissions */
                404: {
                    content: {
                        "text/plain": string;
                    };
                };
                429: external["swagger.yml"]["components"]["responses"]["RateLimitError"];
                500: external["swagger.yml"]["components"]["responses"]["InternalServerError"];
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
        ManifestV2: {
            project: {
                /**
                 * Format: uuid
                 * @description is not present unless getting a preview manifest
                 */
                id?: string;
                /** @description is not present unless getting a preview manifest */
                name?: string;
                /** @description is not present unless getting a preview manifest */
                ui_version?: number;
                pz?: components["schemas"]["PersonalizationManifest"];
                /** @description A/B test settings */
                test?: {
                    [key: string]: external["uniform-context-types.swagger.yml"]["components"]["schemas"]["Test"];
                };
            };
        };
        PersonalizationManifest: {
            /** @description Map of all signals defined for personalization criteria */
            sig?: {
                [key: string]: external["uniform-context-types.swagger.yml"]["components"]["schemas"]["Signal"];
            };
            /** @description Map of all enrichment categories defined for personalization criteria */
            enr?: {
                [key: string]: external["uniform-context-types.swagger.yml"]["components"]["schemas"]["EnrichmentCategory"];
            };
            /** @description Map of all aggregate dimensions (intents or audiences) defined for personalization criteria */
            agg?: {
                [key: string]: external["uniform-context-types.swagger.yml"]["components"]["schemas"]["AggregateDimension"];
            };
            /** @description Percentage of visitors that will be used as a personalization control group (not shown any personalization) */
            control?: number;
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
    "uniform-context-types.swagger.yml": {
        paths: {};
        components: {
            schemas: {
                EnrichmentCategory: {
                    /** @description The maximum visitor score allowed for enrichment keys in this category */
                    cap: number;
                };
                PreviewSignal: external["uniform-context-types.swagger.yml"]["components"]["schemas"]["Signal"] & {
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
                    crit: external["uniform-context-types.swagger.yml"]["components"]["schemas"]["RootSignalCriteriaGroup"];
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
                    clauses: (external["uniform-context-types.swagger.yml"]["components"]["schemas"]["SignalCriteriaGroup"] | external["uniform-context-types.swagger.yml"]["components"]["schemas"]["SignalCriteria"])[];
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
                    clauses: (external["uniform-context-types.swagger.yml"]["components"]["schemas"]["SignalCriteriaGroup"] | external["uniform-context-types.swagger.yml"]["components"]["schemas"]["SignalCriteria"])[];
                };
                SignalCriteria: external["uniform-context-types.swagger.yml"]["components"]["schemas"]["CookieCriteria"] | external["uniform-context-types.swagger.yml"]["components"]["schemas"]["QueryStringCriteria"] | external["uniform-context-types.swagger.yml"]["components"]["schemas"]["QuirkCriteria"] | external["uniform-context-types.swagger.yml"]["components"]["schemas"]["EventCriteria"] | external["uniform-context-types.swagger.yml"]["components"]["schemas"]["CurrentPageCriteria"] | external["uniform-context-types.swagger.yml"]["components"]["schemas"]["PageViewCountCriteria"];
                /** @description Matches a URL query string parameter value */
                QueryStringCriteria: {
                    /** @enum {string} */
                    type: "QS";
                    /** @description The name of the query string parameter to match */
                    queryName: string;
                    /** @description The value to match the query string parameter against */
                    match: external["uniform-context-types.swagger.yml"]["components"]["schemas"]["StringMatch"];
                };
                /** @description Matches a web cookie value */
                CookieCriteria: {
                    /** @enum {string} */
                    type: "CK";
                    /** @description The name of the cookie to match */
                    cookieName: string;
                    /** @description The value to match the cookie against */
                    match: external["uniform-context-types.swagger.yml"]["components"]["schemas"]["StringMatch"];
                };
                /** @description Matches a visitor quirk key and value */
                QuirkCriteria: {
                    /** @enum {string} */
                    type: "QK";
                    /** @description The name of the quirk key to match */
                    key: string;
                    /** @description The quirk value to match against */
                    match: external["uniform-context-types.swagger.yml"]["components"]["schemas"]["StringMatch"];
                };
                /** @description Matches an analytics event name being fired */
                EventCriteria: {
                    /** @enum {string} */
                    type: "EVT";
                    /** @description How to match the event name */
                    event: external["uniform-context-types.swagger.yml"]["components"]["schemas"]["StringMatch"];
                };
                /**
                 * @description Matches the current page's absolute path (i.e. /path/to/page.html)
                 * Does not include the query string or protocol and hostname (i.e. NOT https://foo.com/path/to/page.html?query=something)
                 */
                CurrentPageCriteria: {
                    /** @enum {string} */
                    type: "PV";
                    /** @description The page/route path to match as a page that has been visited */
                    path: external["uniform-context-types.swagger.yml"]["components"]["schemas"]["StringMatch"];
                };
                PageViewCountCriteria: {
                    /** @enum {string} */
                    type: "PVC";
                    /** @description The expression to match the page view count against */
                    match: external["uniform-context-types.swagger.yml"]["components"]["schemas"]["NumberMatch"];
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
                    inputs: external["uniform-context-types.swagger.yml"]["components"]["schemas"]["AggregateDimensionInput"][];
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

type SharedTypes = external['uniform-context-types.swagger.yml']['components']['schemas'];
type ManifestV2 = components['schemas']['ManifestV2'];
type PersonalizationManifest = components['schemas']['PersonalizationManifest'];
type Signal = SharedTypes['Signal'];
type SignalCriteriaGroup = SharedTypes['SignalCriteriaGroup'];
type SignalCriteria = SharedTypes['SignalCriteria'];
type EnrichmentCategory = SharedTypes['EnrichmentCategory'];
type StringMatch = SharedTypes['StringMatch'];
type NumberMatch = SharedTypes['NumberMatch'];
type TestDefinition = SharedTypes['Test'];
type AggregateDimension = SharedTypes['AggregateDimension'];
type AggregateDimensionInput = SharedTypes['AggregateDimensionInput'];

declare class GroupCriteriaEvaluator {
    #private;
    constructor(criteriaEvaluators: Record<string, CriteriaEvaluator>);
    evaluate(update: ContextStateUpdate, crit: SignalCriteriaGroup, commands: StorageCommands[], signal: SignalData, onLogMessage?: (message: LogMessage) => void): CriteriaEvaluatorResult;
}

/**
 * The result of evaluating a signal criteria.
 */
type CriteriaEvaluatorResult = {
    /** Whether the criteria evaluated to true or not */
    result: boolean;
    /**
     * Whether the value of the criteria changed from the previous state
     * If ALL criteria on a signal have NOT changed, the signal is skipped
     * and its score is left alone.
     */
    changed: boolean;
};
type CriteriaEvaluatorParameters = {
    /** The update being made to the Context state */
    update: ContextStateUpdate;
    /** Current criteria to evaluate the update against */
    criteria: SignalCriteria;
    /**
     * The storage commands that will be executed by this update.
     * If the evaluation requires custom commands, push them into this parameter.
     * NOTE: needing to use this is very rare and should be avoided if possible.
     */
    commands: StorageCommands[];
    /** The parent signal containing the criteria we are evaluating */
    signal: SignalData;
    /** Function to emit log notices to the Context log */
    onLogMessage?: (message: LogMessage) => void;
};
type SignalData = Signal & {
    id: string;
};
/**
 * A type that evaluates a signal criteria type and
 * decides if it matches the current Context state or not.
 */
type CriteriaEvaluator = ((parameters: CriteriaEvaluatorParameters) => CriteriaEvaluatorResult) & {
    /** If true the criteria will always execute even if a short-circuit would normally skip it */
    alwaysExecute?: boolean;
};

/** Defines all error codes and their parameter(s)  */
type LogMessages = {
    /** Context constructed */
    1: MessageFunc;
    /** Context received data update */
    2: MessageFunc<Partial<Omit<ContextState, 'url'> & {
        url: string;
    }>>;
    /** Context emitted new score vector */
    3: MessageFunc<ScoreVector>;
    /** Context emitted updated quirks */
    4: MessageFunc<Quirks>;
    /** Tried to set enrichment category that did not exist */
    5: MessageFunc<EnrichmentData>;
    /** Storage received update commands */
    101: MessageFunc<StorageCommands[]>;
    /** Storage data was updated */
    102: MessageFunc<VisitorData>;
    /** Storage data was deleted bool: fromAllDevices */
    103: MessageFunc<boolean>;
    /** Visitor was assigned or removed from control group */
    104: MessageFunc<boolean>;
    /** Storage score was truncated to its cap */
    110: MessageFunc<{
        dim: string;
        score: number;
        cap: number;
    }>;
    /** Storage visitor data expired and was cleared */
    120: MessageFunc;
    /** Server to client transition score data was loaded */
    130: MessageFunc<ServerToClientTransitionState>;
    /** Server to client transition data was discarded */
    131: MessageFunc;
    /** Decay function executed */
    140: MessageFunc<string>;
    /** Signals evaluation beginning */
    200: MessageFunc;
    /** Evaluation of a specific signal beginning */
    201: MessageFunc<SignalData>;
    /** Evaluation of a group beginning */
    202: MessageFunc<SignalCriteriaGroup>;
    203: MessageFunc<{
        criteria: SignalCriteria;
        result: CriteriaEvaluatorResult;
        explanation: string;
    }>;
    /** Result of evaluating a criteria group */
    204: MessageFunc<CriteriaEvaluatorResult>;
    /** Personalization placement executing */
    300: MessageFunc<{
        name: string;
        take?: number;
    }>;
    /** Personalization placement testing variation */
    301: MessageFunc<{
        id: string;
        op?: string;
    }>;
    /** Processed a personalization criteria */
    302: MessageFunc<{
        matched: boolean;
        description: string;
    }>;
    /** Final result for a personalized variation */
    303: MessageFunc<boolean>;
    /** A/B test placement executing */
    400: MessageFunc<string>;
    /** A/B Test definition did not exist */
    401: MessageFunc<string>;
    /** Previously shown test variant no longer in variant data */
    402: MessageFunc<{
        missingVariant: string;
        variants: string[];
    }>;
    /** Selected a new A/B test variation */
    403: MessageFunc<string>;
    /** Displaying A/B test variation */
    404: MessageFunc<string>;
    /** gtag was not present on the page to emit events to */
    700: MessageFunc;
    /** Enabled gtag event signal redirection */
    701: MessageFunc;
};

type Severity = 'debug' | 'info' | 'warn' | 'error';
type MessageCategory = 'context' | 'storage' | 'testing' | 'personalization' | 'gtag' | 'signals';
type OutputSeverity = Severity | 'none';
type MessageFunc<TArg = void> = (arg: TArg) => [
    /** Category of the message */
    MessageCategory,
    /** Log message text */
    string,
    /** Log message */
    ...unknown[]
];
type LogMessage = LogMessageSingle | LogMessageGroup;
type LogMessageSingle<TID extends keyof LogMessages = keyof LogMessages> = [
    severity: Severity,
    id: TID,
    ...args: Parameters<LogMessages[TID]>
];
type LogMessageGroup<TID extends keyof LogMessages = keyof LogMessages> = [severity: Severity, id: TID, group: 'GROUP', ...args: Parameters<LogMessages[TID]>] | [severity: Severity, id: TID, group: 'ENDGROUP'];
type LogDrain = (message: LogMessage) => void;

type VariantMatchCriteria = {
    /**
     * Operation for match criteria
     *
     * @defaultValue `&`
     */
    op?: '&' | '|';
    crit: DimensionMatch[];
    /**
     * Name of the variant for analytics tracking.
     */
    name?: string;
};
type DimensionMatch = {
    /**
     * Left hand side of the match expression (name of dimension in score vector)
     * NOTE: if the dimension is not present in the score vector, it will be treated as if it has a value of 0
     */
    l: string;
    /**
     * Operator of the match expression
     * Whole-vector (RHS only) operators - these do not require a `r` or `rDim` set:
     * +: `l` is the strongest dimension in the score vector
     * -: `l` is the weakest dimension in the score vector. This does not match if the dimension has no score at all.
     *
     * Comparison operators:
     * >: `l` is greater than the right hand side expression
     * >= : `l` is greater than or equal to the right hand side expression
     * <: `l` is less than the right hand side expression
     * <= : `l` is less than or equal to the right hand side expression
     * =: `l` is equal to the right hand side expression
     * !=: `l` is not equal to the right hand side expression
     */
    op: '+' | '-' | '>' | '>=' | '<' | '<=' | '=' | '!=';
    /**
     * Right hand side of the match expression (not required for op = + or - which have no right side)
     * This value is treated as a constant value, if it is present. If it's a string, it is parsed to an integer.
     * To reference another score dimension as the RHS, use the `rDim` property instead.
     * `r` and `rDim` are mutually exclusive; if both are specified, then `rDim` wins.
     */
    r?: number | string;
    /**
     * Right hand side of the match expression (not required for op = + or - which have no right side)
     * This value is treated as a reference to another score dimension, if it is present in the score vector.
     * If the referenced dimension is NOT present in the score vector, the match will always be false.
     * To reference a constant value instead as the RHS, use the `r` property instead.
     * `r` and `rDim` are mutually exclusive; if both are specified, then `rDim` wins.
     */
    rDim?: string;
};

/** Content that is tagged for adding enrichment score when triggered by behavior (i.e. being shown that content) */
type BehaviorTag = {
    beh?: EnrichmentData[];
};
/** Defines the shape of a personalized content variant */
type PersonalizedVariant = {
    /** A unique identifier for this variation */
    id: string;
    /** Match criteria for this variation */
    pz?: VariantMatchCriteria;
};
/** The result of computing personalized content from variations */
type PersonalizedResult<TVariant> = {
    /** Whether or not this result contains a personalized result */
    personalized: boolean;
    /** Matching variations */
    variations: Array<TVariant>;
};
/** Defines the shape of a A/B test variant */
type TestVariant = {
    /** The identifier for this variant. This value persisted to storage when a variant is selected. */
    id: string;
    /**
     * A number between 0 and 100 representing what percentage of visitors will be selected for this variant.
     * If not provided, this variant will be selected in equal proportion to other variants without an explicit distribution.
     */
    testDistribution?: number;
};
/** The result of computing an A/B test result */
type TestResult<TVariant> = {
    /** The selected variation */
    result: TVariant | undefined;
    /**
     * Whether the test variant was newly assigned to the visitor.
     * True: variant was assigned to the visitor for the first time.
     * False: variant was already assigned to the visitor and is being reused.
     */
    variantAssigned: boolean;
};

type PersonalizeOptions<TVariant> = {
    /** Name of placement (sent to analytics) */
    name: string;
    /** Possible variants to place  */
    variations: Iterable<TVariant>;
    /** Maximum number of variants to place (default: 1) */
    take?: number;
    onLogMessage?: (message: LogMessage) => void;
};
declare function personalizeVariations<TVariant extends PersonalizedVariant>({ name, context, variations, take, onLogMessage, }: PersonalizeOptions<TVariant> & {
    context: Context;
}): PersonalizedResult<TVariant>;

type TestOptions<TVariant extends TestVariant> = {
    /** The name of the test that is being run, must be included in the manifest. */
    name: string;
    /** Variations that are being tested. */
    variations: TVariant[];
};
declare const testVariations: <TVariant extends TestVariant>({ name, context, variations, onLogMessage, }: TestOptions<TVariant> & {
    context: Context;
    onLogMessage?: ((message: LogMessage) => void) | undefined;
}) => TestResult<TVariant>;

declare const CONTEXTUAL_EDITING_TEST_NAME = "contextual_editing_test";
declare const CONTEXTUAL_EDITING_TEST_SELECTED_VARIANT_ID = "contextual_editing_test_selected_variant";
/**
 * Defines a plugin for Uniform Context.
 * The plugin should attach event handlers in its creation function.
 * @returns A function that detaches any event handlers when called
 */
type ContextPlugin = {
    logDrain?: LogDrain;
    init?: (context: Context) => () => void;
};
type ContextOptions = {
    /** The Context Manifest to load (from the Context API) */
    manifest: ManifestV2;
    /**
     * Context plugins to load at initialize time.
     * Plugins that hook to the log event should be added here so that they can catch init-time log message events.
     *
     * Note that the Context passed to the plugin is not yet fully initialized, and is intended for event handler attachment
     * only - don't call scores, update, etc on it. If you need to call these methods immediately, attach your plugin after initialisation.
     */
    plugins?: Array<ContextPlugin>;
} & Omit<VisitorDataStoreOptions, 'manifest' | 'onServerTransitionScoresReceived'>;
/** Emitted when a personalization runs */
type PersonalizationEvent = {
    /** Name of the personalized placement */
    name: string;
    /** Selected variant ID(s) */
    variantIds: string[];
    /** Whether the user was part of the control group (and did not receive any personalization) */
    control: boolean | undefined;
    /**
     * Whether the personalized placement has changed since the last time the placement was evaluated.
     * True: the placement was evaluated for the first time, or the variant(s) selected changed from last time (e.g. due to a score change that activated a new variant).
     * False: the variant(s) selected were the same as a previous evaluation of this placement.
     */
    changed: boolean;
};
/** Emitted event when an A/B test runs */
type TestEvent = {
    /** Name (public ID) of the A/B test */
    name: string;
    /** ID of the variant that was selected */
    variantId: string | undefined;
    /**
     * Whether the test variant was newly assigned to the visitor.
     * True: variant was assigned to the visitor for the first time.
     * False: variant was already assigned to the visitor and is being reused.
     */
    variantAssigned: boolean;
};
type ContextEvents = {
    /**
     * Fired when the scores are updated.
     * The event is NOT fired if an update does not result in any score changes.
     * The result is merged between session and permanent data.
     */
    scoresUpdated: Readonly<ScoreVector>;
    /**
     * Fired when quirk data changes. Not fired if no changes to quirks are made
     * (e.g. setting it to the same value it already has)
     */
    quirksUpdated: Quirks;
    /**
     * Fired when a log message is emitted from Context
     * Note that event handlers attached to this event will not catch events
     * logged during initialisation of the Context unless they are attached as plugins to the constructor.
     */
    log: LogMessage | LogMessageGroup;
    /** Test variant has been selected */
    testResult: TestEvent;
    /** Personalization variants have been selected */
    personalizationResult: PersonalizationEvent;
};
interface ContextInstance {
    get scores(): Readonly<ScoreVector>;
    get quirks(): Readonly<Quirks>;
    update(newData: Partial<ContextState>): Promise<void>;
    getTestVariantId(testName: string): string | null | undefined;
    setTestVariantId(testName: string, variantId: string): void;
    log(...message: LogMessage): void;
    test<TVariant extends TestVariant>(options: TestOptions<TVariant>): TestResult<TVariant>;
    personalize<TVariant extends PersonalizedVariant>(options: PersonalizeOptions<TVariant>): PersonalizedResult<TVariant>;
    forget(fromAllDevices: boolean): Promise<void>;
    getServerToClientTransitionState(): ServerToClientTransitionState;
    readonly manifest: ManifestInstance;
    /** @deprecated */
    internal_processTestEvent(event: TestEvent): void;
    /** @deprecated */
    internal_processPersonalizationEvent(event: PersonalizationEvent): void;
}
declare class Context implements ContextInstance {
    #private;
    readonly manifest: ManifestInstance;
    constructor(options: ContextOptions);
    /** Gets the current visitor's dimension score vector. */
    get scores(): Readonly<ScoreVector>;
    /** Gets the current visitor's quirks values. */
    get quirks(): Readonly<Quirks>;
    /**
     * Subscribe to events
     */
    readonly events: {
        on: {
            <Key extends keyof ContextEvents>(type: Key, handler: mitt.Handler<ContextEvents[Key]>): void;
            (type: "*", handler: mitt.WildcardHandler<ContextEvents>): void;
        };
        off: {
            <Key_1 extends keyof ContextEvents>(type: Key_1, handler?: mitt.Handler<ContextEvents[Key_1]> | undefined): void;
            (type: "*", handler: mitt.WildcardHandler<ContextEvents>): void;
        };
    };
    readonly storage: VisitorDataStore;
    /**
     * Updates the Context with new data of any sort, such as
     * new URLs, cookies, quirks, and enrichments.
     *
     * Only properties that are set in the data parameter will be updated.
     * Properties that do not result in a changed state,
     * i.e. pushing the same URL or cookies as before,
     * will NOT result in a recomputation of signal state.
     */
    update(newData: Partial<ContextState>): Promise<void>;
    /** use test() instead */
    getTestVariantId(testName: string): string | null | undefined;
    /** use test() instead */
    setTestVariantId(testName: string, variantId: string): void;
    /**
     * Writes a message to the Context log sink.
     * Used by Uniform internal SDK; not intended for public use.
     */
    log(...message: LogMessage): void;
    /** Executes an A/B test with a given set of variants, showing the visitor's assigned variant (or selecting one to assign, if none is set yet) */
    test<TVariant extends TestVariant>(options: TestOptions<TVariant>): TestResult<TVariant>;
    /** Executes a personalized placement with a given set of variants */
    personalize<TVariant extends PersonalizedVariant>(options: PersonalizeOptions<TVariant>): PersonalizedResult<TVariant>;
    /**
     * Forgets the visitor's data and resets the Context to its initial state.
     * @param fromAllDevices for an identified user, whether to delete all their data (for the entire account) - true, or data for this device (sign out) - false
     */
    forget(fromAllDevices: boolean): Promise<void>;
    /**
     * Computes server to client transition state.
     *
     * Removes state from server-to-client if it came in initial state (cookies) to avoid double tracking on the client.
     */
    getServerToClientTransitionState(): ServerToClientTransitionState;
    /** @deprecated */
    internal_processTestEvent(event: TestEvent): void;
    /** @deprecated */
    internal_processPersonalizationEvent(event: PersonalizationEvent): void;
}

/**
 * The version of the DevTools UI to load when in Chromium extension context.
 * 1: Uniform Optimize.
 * 2: Uniform Context.
 */
type DevToolsUiVersion = 1 | 2;
/**
 * The data state provided to the devtools for rendering.
 */
type DevToolsState = {
    /** Current computed visitor scores (includes aggregates) */
    scores: Readonly<ScoreVector>;
    /** Current visitor data (includes quirks, raw scores, tests, consent, etc) */
    data: Readonly<VisitorData>;
    /** Personalization events that have fired since devtools started */
    personalizations: Array<PersonalizationEvent>;
    /** Test events that have fired since devtools started */
    tests: Array<TestEvent>;
    /** The Context manifest */
    manifest: ManifestV2;
};
/** Mutations the DevTools can take on the data it receives */
type DevToolsActions = {
    /** Standard updates; maps to Context.update() */
    update: (newData: Partial<ContextState>) => Promise<void>;
    /** Raw updates to the storage subsystem. Maps to Context.storage.updateData() */
    rawUpdate: (commands: StorageCommands[]) => Promise<void>;
    /** Forget the current visitor and clear data on this device */
    forget: () => Promise<void>;
};
type DevToolsEvent<Type extends string = string, TEventData = unknown> = {
    /** The integration ID that is required */
    type: Type;
} & TEventData;
type DevToolsEvents = DevToolsLogEvent | DevToolsDataEvent | DevToolsHelloEvent | DevToolsUpdateEvent | DevToolsRawCommandsEvent | DevToolsForgetEvent;
/** A log message emitted as an event to the browser extension */
type DevToolsLogEvent = DevToolsEvent<'uniform:context:log', {
    message: LogMessage;
}>;
/** Emitted when data is updated in Context to the devtools */
type DevToolsDataEvent = DevToolsEvent<'uniform:context:data', {
    data: DevToolsState;
}>;
/** A hello message emitted as an event from the browser extension to test if the page contains Context */
type DevToolsHelloEvent = DevToolsEvent<'uniform:context:hello', {
    uiVersion: DevToolsUiVersion;
}>;
/** Devtools requests a normal update cycle (regular data update, re-eval signals, etc) */
type DevToolsUpdateEvent = DevToolsEvent<'uniform-in:context:update', {
    newData: Partial<ContextState>;
}>;
/** Devtools requests a raw update cycle (explicitly set scores of dimensions in durations, etc) */
type DevToolsRawCommandsEvent = DevToolsEvent<'uniform-in:context:commands', {
    commands: StorageCommands[];
}>;
/** A request to forget me from the DevTools */
type DevToolsForgetEvent = DevToolsEvent<'uniform-in:context:forget', unknown>;
declare global {
    interface Window {
        /** Window var set by enableContextDevTools() to enable embedded devtools to receive Context instance and attach events to it. */
        __UNIFORM_DEVTOOLS_CONTEXT_INSTANCE__?: Context;
    }
}

export { type TestOptions as $, type AggregateDimension as A, type MessageFunc as B, type ContextPlugin as C, type DecayFunction as D, type LogMessageSingle as E, type LogMessageGroup as F, ManifestInstance as G, GroupCriteriaEvaluator as H, type CriteriaEvaluatorResult as I, type CriteriaEvaluatorParameters as J, type SignalData as K, type LogDrain as L, type MessageCategory as M, type ManifestV2 as N, type OutputSeverity as O, type PersonalizationEvent as P, type PersonalizationManifest as Q, type Signal as R, type ScoreVector as S, TransitionDataStore as T, type SignalCriteriaGroup as U, type VisitorData as V, type SignalCriteria as W, type EnrichmentCategory as X, type NumberMatch as Y, type TestDefinition as Z, type AggregateDimensionInput as _, type StorageCommands as a, testVariations as a0, type DimensionMatch as a1, type PersonalizeOptions as a2, personalizeVariations as a3, type BehaviorTag as a4, type PersonalizedVariant as a5, type PersonalizedResult as a6, type TestVariant as a7, type TestResult as a8, type StorageCommand as a9, type ModifyScoreCommand as aa, type ModifySessionScoreCommand as ab, type SetConsentCommand as ac, type SetQuirkCommand as ad, type SetTestCommand as ae, type IdentifyCommand as af, type SetControlGroupCommand as ag, type ServerToClientTransitionState as ah, SERVER_STATE_ID as ai, type TransitionDataStoreEvents as aj, type DecayOptions as ak, type VisitorDataStoreOptions as al, type VisitorDataStoreEvents as am, VisitorDataStore as an, type Quirks as ao, type Tests as ap, type EnrichmentData as aq, type EventData as ar, emptyVisitorData as as, type ContextState as at, type ContextStateUpdate as au, type paths as av, type TransitionDataStoreOptions as b, type CriteriaEvaluator as c, type StringMatch as d, type VariantMatchCriteria as e, type LogMessage as f, type DevToolsEvents as g, CONTEXTUAL_EDITING_TEST_NAME as h, CONTEXTUAL_EDITING_TEST_SELECTED_VARIANT_ID as i, type ContextOptions as j, type TestEvent as k, type ContextEvents as l, type ContextInstance as m, Context as n, type DevToolsUiVersion as o, type DevToolsState as p, type DevToolsActions as q, type DevToolsEvent as r, type DevToolsLogEvent as s, type DevToolsDataEvent as t, type DevToolsHelloEvent as u, type DevToolsUpdateEvent as v, type DevToolsRawCommandsEvent as w, type DevToolsForgetEvent as x, type LogMessages as y, type Severity as z };
