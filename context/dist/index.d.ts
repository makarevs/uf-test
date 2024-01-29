import { O as OutputSeverity, L as LogDrain, C as ContextPlugin, S as ScoreVector, A as AggregateDimension, T as TransitionDataStore, a as StorageCommands, V as VisitorData, b as TransitionDataStoreOptions, D as DecayFunction, c as CriteriaEvaluator, d as StringMatch, e as VariantMatchCriteria, f as LogMessage, g as DevToolsEvents } from './types-R41eD1zH.js';
export { _ as AggregateDimensionInput, a4 as BehaviorTag, h as CONTEXTUAL_EDITING_TEST_NAME, i as CONTEXTUAL_EDITING_TEST_SELECTED_VARIANT_ID, n as Context, l as ContextEvents, m as ContextInstance, j as ContextOptions, at as ContextState, au as ContextStateUpdate, J as CriteriaEvaluatorParameters, I as CriteriaEvaluatorResult, ak as DecayOptions, q as DevToolsActions, t as DevToolsDataEvent, r as DevToolsEvent, x as DevToolsForgetEvent, u as DevToolsHelloEvent, s as DevToolsLogEvent, w as DevToolsRawCommandsEvent, p as DevToolsState, o as DevToolsUiVersion, v as DevToolsUpdateEvent, a1 as DimensionMatch, X as EnrichmentCategory, aq as EnrichmentData, ar as EventData, H as GroupCriteriaEvaluator, af as IdentifyCommand, F as LogMessageGroup, E as LogMessageSingle, y as LogMessages, G as ManifestInstance, N as ManifestV2, M as MessageCategory, B as MessageFunc, aa as ModifyScoreCommand, ab as ModifySessionScoreCommand, Y as NumberMatch, P as PersonalizationEvent, Q as PersonalizationManifest, a2 as PersonalizeOptions, a6 as PersonalizedResult, a5 as PersonalizedVariant, ao as Quirks, ai as SERVER_STATE_ID, ah as ServerToClientTransitionState, ac as SetConsentCommand, ag as SetControlGroupCommand, ad as SetQuirkCommand, ae as SetTestCommand, z as Severity, R as Signal, W as SignalCriteria, U as SignalCriteriaGroup, K as SignalData, a9 as StorageCommand, Z as TestDefinition, k as TestEvent, $ as TestOptions, a8 as TestResult, a7 as TestVariant, ap as Tests, aj as TransitionDataStoreEvents, an as VisitorDataStore, am as VisitorDataStoreEvents, al as VisitorDataStoreOptions, as as emptyVisitorData, a3 as personalizeVariations, a0 as testVariations } from './types-R41eD1zH.js';
import Cookies from 'js-cookie';
import 'mitt';

/**
 * Creates a new log drain that will log to the console.
 * The log drain will only log event IDs, but is much smaller than the
 * debug log drain.
 *
 * NOTE: you probably want enableConsoleLogDrain() instead of this function.
 */
declare function createConsoleLogDrain(level: OutputSeverity): LogDrain;
/**
 * Enables logging Context events to the browser console.
 * Lightweight events with only the event ID are emitted.
 */
declare function enableConsoleLogDrain(level: OutputSeverity): ContextPlugin;

/** Computes aggregated scores based on other dimensions */
declare function computeAggregateDimensions(primitiveScores: ScoreVector, aggregates: Record<string, AggregateDimension>): ScoreVector;

type CookieTransitionDataStoreOptions = {
    /**
     * The value of the score cookie during server-side rendering.
     * Should be parsed from the incoming request.
     * IMPORTANT: If not passed, the transition store will not have any effect during SSR.
     */
    serverCookieValue?: string;
    /**
     * The name of the cookie to store client-to-server score information in.
     * Defaults to UNIFORM_DEFAULT_COOKIE_NAME if not set.
     */
    cookieName?: string;
    /**
     * Attributes to set on the transfer cookie.
     * Persistence is not necessary, because the data is only used for temporary transition;
     * local storage is the master copy. Defaults to SameSite=Lax.
     */
    cookieAttributes?: Cookies.CookieAttributes;
};
declare const UNIFORM_DEFAULT_COOKIE_NAME = "ufvd";
/**
 * Handles client-to-server score handoff using an encoded cookie with the visitor score vector.
 * NOTE: forget me is not supported when on the server side.
 */
declare class CookieTransitionDataStore extends TransitionDataStore {
    #private;
    constructor({ serverCookieValue, cookieName, cookieAttributes, }: CookieTransitionDataStoreOptions);
    handleDelete(): Promise<void>;
    handleUpdateData(_: StorageCommands[], computedValue: VisitorData): Promise<void>;
}

type EdgeTransitionDataStoreOptions = TransitionDataStoreOptions & {
    serverCookieValue?: string;
    visitorIdCookieName?: string;
};
declare class EdgeTransitionDataStore extends TransitionDataStore {
    #private;
    constructor({ serverCookieValue, visitorIdCookieName, ...base }: EdgeTransitionDataStoreOptions);
    handleDelete(fromAllDevices?: boolean): Promise<void>;
    handleUpdateData(commands: StorageCommands[]): Promise<void>;
}

type LinearDecayOptions = {
    /**
     * The length of time before decay starts, in msec.
     * Default: 1 day (8.64e7)
     */
    gracePeriod?: number;
    /**
     * How much the score decays per day (decimal, 0-1).
     * Default: decay over 30 days (1/30)
     *
     * Note: the grace period is not included in this rate,
     * so if the grace period is 1 day and the decay rate is 1/30,
     * it would take 31 days to hit max decay.
     */
    decayRate?: number;
    /**
     * The maximum amount of decay that can occur at once (decimal, 0-1)
     * Default: 95% (0.95)
     */
    decayCap?: number;
};
/**
 * Creates a function that applies linear decay to scores over time.
 */
declare function createLinearDecay(options?: LinearDecayOptions): DecayFunction;

declare function getEnrichmentVectorKey(category: string, value: string): string;

declare const cookieEvaluator: CriteriaEvaluator;

declare const currentPageEvaluator: CriteriaEvaluator;

declare const eventEvaluator: CriteriaEvaluator;

declare const pageViewCountDimension: string;
declare const pageViewCountEvaluator: CriteriaEvaluator;

declare const queryStringEvaluator: CriteriaEvaluator;

declare const quirkEvaluator: CriteriaEvaluator;

/** Tests if a StringMatch matches a string value */
declare function isStringMatch(lhs: string | number | null | undefined, match: StringMatch): boolean;
declare function explainStringMatch(lhs: string | number | null | undefined, match: StringMatch): string;
declare function explainStringMatchCriteria(match: StringMatch): string;

type ConsoleDebugLogDrainOptions = {
    enableOnServer?: boolean;
};
/**
 * Creates a new log drain that will log full debug messages to the console.
 * The debug log drain adds significant bundle size, but is useful for debugging.
 *
 * NOTE: you probably want enableDebugConsoleLogDrain() instead of this function.
 */
declare function createDebugConsoleLogDrain(level: OutputSeverity, options?: ConsoleDebugLogDrainOptions): LogDrain;
/**
 * Enables logging Context events to the browser console.
 * Lightweight events with only the event ID are emitted.
 */
declare function enableDebugConsoleLogDrain(level: OutputSeverity, options?: ConsoleDebugLogDrainOptions): ContextPlugin;

declare function evaluateVariantMatch(variantId: string, match: VariantMatchCriteria | undefined | null, vec: ScoreVector, onLogMessage?: (message: LogMessage) => void): boolean;

type ContextDevToolOptions = {
    onAfterMessageReceived?: (message: DevToolsEvents) => void;
};
/**
 * Enables a Context instance to feed data to the Uniform Context DevTools.
 * DevTools can be hosted either as a Chromium extension, or as a standalone
 * React app within a page and receive data once this plugin has been activated.
 * @returns Function that when invoked detaches the event listeners and disables DevTools.
 */
declare function enableContextDevTools(options?: ContextDevToolOptions): ContextPlugin;

declare enum ScriptType {
    ListStart = "nesi-list-start",
    ListEnd = "nesi-list-end",
    ListItem = "nesi-list-item-html",
    ListItemSettings = "nesi-list-item-settings",
    TestStart = "nesi-test-start",
    TestEnd = "nesi-test-end",
    Unknown = "unknown"
}
type EdgePersonalizeComponentOptions = {
    name: string;
    count?: number;
};
type EdgeTestComponentOptions = {
    name: string;
};
declare const EdgeNodeTagName = "nesitag";

type QuickConnectConfig = {
    apiKey: string;
    projectId: string;
    apiHost?: string;
};
declare function serializeQuickConnect(config: QuickConnectConfig): string;
declare function parseQuickConnect(serialized: string): Required<QuickConnectConfig>;

export { AggregateDimension, type ConsoleDebugLogDrainOptions, type ContextDevToolOptions, ContextPlugin, CookieTransitionDataStore, type CookieTransitionDataStoreOptions, CriteriaEvaluator, DecayFunction, DevToolsEvents, EdgeNodeTagName, type EdgePersonalizeComponentOptions, type EdgeTestComponentOptions, EdgeTransitionDataStore, type EdgeTransitionDataStoreOptions, type LinearDecayOptions, LogDrain, LogMessage, OutputSeverity, type QuickConnectConfig, ScoreVector, ScriptType, StorageCommands, StringMatch, TransitionDataStore, TransitionDataStoreOptions, UNIFORM_DEFAULT_COOKIE_NAME, VariantMatchCriteria, VisitorData, computeAggregateDimensions, cookieEvaluator, createConsoleLogDrain, createDebugConsoleLogDrain, createLinearDecay, currentPageEvaluator, enableConsoleLogDrain, enableContextDevTools, enableDebugConsoleLogDrain, evaluateVariantMatch, eventEvaluator, explainStringMatch, explainStringMatchCriteria, getEnrichmentVectorKey, isStringMatch, pageViewCountDimension, pageViewCountEvaluator, parseQuickConnect, queryStringEvaluator, quirkEvaluator, serializeQuickConnect };
