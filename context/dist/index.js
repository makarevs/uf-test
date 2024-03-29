"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  CONTEXTUAL_EDITING_TEST_NAME: () => CONTEXTUAL_EDITING_TEST_NAME,
  CONTEXTUAL_EDITING_TEST_SELECTED_VARIANT_ID: () => CONTEXTUAL_EDITING_TEST_SELECTED_VARIANT_ID,
  Context: () => Context,
  CookieTransitionDataStore: () => CookieTransitionDataStore,
  EdgeNodeTagName: () => EdgeNodeTagName,
  EdgeTransitionDataStore: () => EdgeTransitionDataStore,
  GroupCriteriaEvaluator: () => GroupCriteriaEvaluator,
  ManifestInstance: () => ManifestInstance,
  SERVER_STATE_ID: () => SERVER_STATE_ID,
  ScriptType: () => ScriptType,
  TransitionDataStore: () => TransitionDataStore,
  UNIFORM_DEFAULT_COOKIE_NAME: () => UNIFORM_DEFAULT_COOKIE_NAME,
  VisitorDataStore: () => VisitorDataStore,
  computeAggregateDimensions: () => computeAggregateDimensions,
  cookieEvaluator: () => cookieEvaluator,
  createConsoleLogDrain: () => createConsoleLogDrain,
  createDebugConsoleLogDrain: () => createDebugConsoleLogDrain,
  createLinearDecay: () => createLinearDecay,
  currentPageEvaluator: () => currentPageEvaluator,
  emptyVisitorData: () => emptyVisitorData,
  enableConsoleLogDrain: () => enableConsoleLogDrain,
  enableContextDevTools: () => enableContextDevTools,
  enableDebugConsoleLogDrain: () => enableDebugConsoleLogDrain,
  evaluateVariantMatch: () => evaluateVariantMatch,
  eventEvaluator: () => eventEvaluator,
  explainStringMatch: () => explainStringMatch,
  explainStringMatchCriteria: () => explainStringMatchCriteria,
  getEnrichmentVectorKey: () => getEnrichmentVectorKey,
  isStringMatch: () => isStringMatch,
  pageViewCountDimension: () => pageViewCountDimension,
  pageViewCountEvaluator: () => pageViewCountEvaluator,
  parseQuickConnect: () => parseQuickConnect,
  personalizeVariations: () => personalizeVariations,
  queryStringEvaluator: () => queryStringEvaluator,
  quirkEvaluator: () => quirkEvaluator,
  serializeQuickConnect: () => serializeQuickConnect,
  testVariations: () => testVariations
});
module.exports = __toCommonJS(src_exports);

// src/manifest/aggregates/computeAggregateDimensions.ts
function computeAggregateDimensions(primitiveScores, aggregates) {
  const result = { ...primitiveScores };
  for (const aggregateDimension in aggregates) {
    const aggregateScore = computeAggregateDimension(
      primitiveScores,
      aggregateDimension,
      aggregates,
      /* @__PURE__ */ new Set([aggregateDimension])
    );
    if (aggregateScore !== 0) {
      result[aggregateDimension] = aggregateScore;
    }
  }
  return result;
}
function computeAggregateDimension(primitiveScores, aggregateDimension, allAggregates, visitedDimensions) {
  var _a;
  let aggregateScore = 0;
  for (const input of allAggregates[aggregateDimension].inputs) {
    let currentScore = (_a = primitiveScores[input.dim]) != null ? _a : 0;
    if (!currentScore) {
      const aggRef = allAggregates[input.dim];
      if (aggRef) {
        if (visitedDimensions.has(input.dim)) {
          continue;
        }
        const newVisited = new Set(visitedDimensions);
        newVisited.add(input.dim);
        currentScore = computeAggregateDimension(primitiveScores, input.dim, allAggregates, newVisited);
      }
    }
    if (currentScore !== 0) {
      if (input.sign === "c") {
        aggregateScore = 0;
        break;
      } else if (input.sign === "-") {
        aggregateScore -= currentScore;
      } else {
        aggregateScore += currentScore;
      }
    }
  }
  return aggregateScore;
}

// src/manifest/constants.ts
var ENR_SEPARATOR = "_";

// src/manifest/signals/SignalInstance.ts
var _evaluator, _onLogMessage;
var SignalInstance = class {
  constructor(data, evaluator, onLogMessage) {
    __privateAdd(this, _evaluator, void 0);
    __privateAdd(this, _onLogMessage, void 0);
    __publicField(this, "signal");
    this.signal = data;
    __privateSet(this, _evaluator, evaluator);
    __privateSet(this, _onLogMessage, onLogMessage);
  }
  /** Computes storage update commands to take based on a state update and the signal's criteria */
  computeSignal(update, commands) {
    const isAtCap = update.scores[this.signal.id] >= this.signal.cap;
    if (isAtCap && this.signal.dur !== "t") {
      return;
    }
    const criteriaMatchUpdate = __privateGet(this, _evaluator).evaluate(
      update,
      this.signal.crit,
      commands,
      this.signal,
      __privateGet(this, _onLogMessage)
    );
    const scoreCommand = this.signal.dur === "s" || this.signal.dur === "t" ? "modscoreS" : "modscore";
    if (!criteriaMatchUpdate.changed) {
      return;
    }
    if (criteriaMatchUpdate.result) {
      commands.push({
        type: scoreCommand,
        data: { dimension: this.signal.id, delta: this.signal.str }
      });
    } else if (this.signal.dur === "t") {
      const sessionScore = update.visitor.sessionScores[this.signal.id];
      if (sessionScore) {
        commands.push({
          type: scoreCommand,
          data: { dimension: this.signal.id, delta: -sessionScore }
        });
      }
    }
  }
};
_evaluator = new WeakMap();
_onLogMessage = new WeakMap();

// src/manifest/ManifestInstance.ts
var _mf, _signalInstances, _onLogMessage2;
var ManifestInstance = class {
  constructor({
    manifest,
    evaluator = new GroupCriteriaEvaluator({}),
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onLogMessage = () => {
    }
  }) {
    __publicField(this, "data");
    __privateAdd(this, _mf, void 0);
    __privateAdd(this, _signalInstances, void 0);
    __privateAdd(this, _onLogMessage2, void 0);
    var _a, _b, _c;
    __privateSet(this, _mf, (_a = manifest.project) != null ? _a : {});
    this.data = manifest;
    __privateSet(this, _signalInstances, Object.entries((_c = (_b = __privateGet(this, _mf).pz) == null ? void 0 : _b.sig) != null ? _c : []).map(
      ([id, signal]) => new SignalInstance({ ...signal, id }, evaluator, onLogMessage)
    ));
    __privateSet(this, _onLogMessage2, onLogMessage);
  }
  rollForControlGroup() {
    var _a, _b;
    let control = (_b = (_a = __privateGet(this, _mf).pz) == null ? void 0 : _a.control) != null ? _b : 0;
    if (control >= 1) {
      control = control / 100;
    }
    return Math.random() < control;
  }
  getTest(name) {
    var _a;
    return (_a = __privateGet(this, _mf).test) == null ? void 0 : _a[name];
  }
  computeSignals(update) {
    const commands = [];
    __privateGet(this, _onLogMessage2).call(this, ["debug", 200, "GROUP"]);
    try {
      __privateGet(this, _signalInstances).forEach((signal) => {
        __privateGet(this, _onLogMessage2).call(this, ["debug", 201, "GROUP", signal.signal]);
        try {
          signal.computeSignal(update, commands);
        } finally {
          __privateGet(this, _onLogMessage2).call(this, ["debug", 201, "ENDGROUP"]);
        }
      });
    } finally {
      __privateGet(this, _onLogMessage2).call(this, ["debug", 200, "ENDGROUP"]);
    }
    return commands;
  }
  /**
   * Computes aggregated scores based on other dimensions
   */
  computeAggregateDimensions(primitiveScores) {
    var _a, _b;
    return computeAggregateDimensions(primitiveScores, (_b = (_a = __privateGet(this, _mf).pz) == null ? void 0 : _a.agg) != null ? _b : {});
  }
  getDimensionByKey(scoreKey) {
    var _a, _b, _c, _d;
    const enrichmentIndex = scoreKey.indexOf(ENR_SEPARATOR);
    if (enrichmentIndex <= 0) {
      return (_b = (_a = __privateGet(this, _mf).pz) == null ? void 0 : _a.sig) == null ? void 0 : _b[scoreKey];
    }
    return (_d = (_c = __privateGet(this, _mf).pz) == null ? void 0 : _c.enr) == null ? void 0 : _d[scoreKey.substring(0, enrichmentIndex)];
  }
};
_mf = new WeakMap();
_signalInstances = new WeakMap();
_onLogMessage2 = new WeakMap();

// src/manifest/signals/criteria/evaluators/cookieEvaluator.ts
var import_lite = require("dequal/lite");

// src/manifest/signals/criteria/util/isStringMatch.ts
function isStringMatch(lhs, match) {
  var _a, _b, _c, _d, _e, _f;
  const type = (_a = match == null ? void 0 : match.op) != null ? _a : "=";
  if (match.op === "*") {
    return lhs !== null && typeof lhs !== "undefined";
  }
  if (match.op === "!*") {
    return lhs === null || typeof lhs === "undefined";
  }
  if (!("rhs" in match)) {
    throw new Error(`Match expression is required for match type ${type}`);
  }
  const caseSensitive = (_b = match.cs) != null ? _b : false;
  const localRhs = (caseSensitive ? lhs != null ? lhs : "" : caseDesensitize(lhs)).toString();
  const localLhs = (caseSensitive ? match.rhs : caseDesensitize(match.rhs)).toString();
  switch (type) {
    case "=":
      return localRhs === localLhs;
    case "!=":
      return localRhs !== localLhs;
    case "~":
      return (_c = localRhs.includes(localLhs)) != null ? _c : false;
    case "!~":
      return !((_d = localRhs.includes(localLhs)) != null ? _d : true);
    case "//":
      return new RegExp(match.rhs.toString(), caseSensitive ? "" : "i").test((_e = lhs == null ? void 0 : lhs.toString()) != null ? _e : "");
    case "!//":
      return !new RegExp(match.rhs.toString(), caseSensitive ? "" : "i").test((_f = lhs == null ? void 0 : lhs.toString()) != null ? _f : "");
    default:
      throw new Error(`Unknown match type ${type}.`);
  }
}
function explainStringMatch(lhs, match) {
  const cs = "cs" in match ? match.cs : false;
  return `'${cs ? lhs : lhs == null ? void 0 : lhs.toString().toUpperCase()}' ${explainStringMatchCriteria(match)}`;
}
function explainStringMatchCriteria(match) {
  if ("rhs" in match) {
    return `${match.op} '${match.cs ? match.rhs : match.rhs.toString().toUpperCase()}'`;
  }
  return `${match.op === "*" ? "exists" : "does not exist"}`;
}
function caseDesensitize(value) {
  var _a, _b;
  return (_b = (_a = value == null ? void 0 : value.toString()) == null ? void 0 : _a.toUpperCase()) != null ? _b : "";
}

// src/manifest/signals/criteria/evaluators/cookieEvaluator.ts
var cookieEvaluator = ({ update, criteria, onLogMessage }) => {
  var _a, _b;
  if (criteria.type !== "CK") {
    return { result: false, changed: false };
  }
  const changed = !(0, import_lite.dequal)(cleanCookies(update.state.cookies), cleanCookies((_a = update.previousState) == null ? void 0 : _a.cookies));
  const value = (_b = update.state.cookies) == null ? void 0 : _b[criteria.cookieName];
  const result = isStringMatch(value, criteria.match);
  const finalResult = { result, changed };
  onLogMessage == null ? void 0 : onLogMessage([
    "debug",
    203,
    { criteria, result: finalResult, explanation: explainStringMatch(value, criteria.match) }
  ]);
  return finalResult;
};
function cleanCookies(cookie) {
  if (!cookie) {
    return void 0;
  }
  if (!cookie.ufvd) {
    return cookie;
  }
  const { ufvd, ...rest } = cookie;
  return rest;
}

// src/manifest/signals/criteria/evaluators/currentPageEvaluator.ts
var currentPageEvaluator = ({ update, criteria, onLogMessage }) => {
  var _a, _b, _c;
  if (criteria.type !== "PV") {
    return { result: false, changed: false };
  }
  const value = (_a = update.state.url) == null ? void 0 : _a.pathname;
  const hasUrlChanged = !update.previousState || (value == null ? void 0 : value.toString()) !== ((_c = (_b = update.previousState.url) == null ? void 0 : _b.pathname) == null ? void 0 : _c.toString());
  const result = isStringMatch(value, criteria.path);
  const finalResult = { result, changed: hasUrlChanged };
  onLogMessage == null ? void 0 : onLogMessage([
    "debug",
    203,
    { criteria, result: finalResult, explanation: explainStringMatch(value, criteria.path) }
  ]);
  return finalResult;
};

// src/manifest/signals/criteria/evaluators/eventEvaluator.ts
var eventEvaluator = ({ update, criteria, onLogMessage }) => {
  var _a, _b, _c;
  if (criteria.type !== "EVT") {
    return { result: false, changed: false };
  }
  const result = (_b = (_a = update.state.events) == null ? void 0 : _a.some((event) => isStringMatch(event.event, criteria.event))) != null ? _b : false;
  const finalResult = { result, changed: result };
  onLogMessage == null ? void 0 : onLogMessage([
    "debug",
    203,
    {
      criteria,
      result: finalResult,
      explanation: `'${(_c = update.state.events) == null ? void 0 : _c.join("', '")}' ${explainStringMatchCriteria(criteria.event)}`
    }
  ]);
  return finalResult;
};

// src/manifest/utils/getEnrichmentVectorKey.ts
function getEnrichmentVectorKey(category, value) {
  return `${category}${ENR_SEPARATOR}${value}`;
}

// src/manifest/signals/criteria/util/isNumberMatch.ts
function isNumberMatch(lhs, match) {
  var _a;
  if (typeof lhs === "undefined" || lhs === null) {
    return false;
  }
  const lhsValue = Number(lhs);
  if (isNaN(lhsValue)) {
    return false;
  }
  switch ((_a = match == null ? void 0 : match.op) != null ? _a : "=") {
    case "=":
      return lhsValue === match.rhs;
    case "!=":
      return lhsValue !== match.rhs;
    case ">":
      return lhsValue > match.rhs;
    case "<":
      return lhsValue < match.rhs;
    default:
      console.warn(`Unknown match type ${match.op} is false.`);
      return false;
  }
}
function explainNumberMatch(lhs, match) {
  return `${lhs} ${explainNumberMatchCriteria(match)}`;
}
function explainNumberMatchCriteria(match) {
  return `${match.op} ${match.rhs}`;
}

// src/manifest/signals/criteria/evaluators/pageViewCountEvaluator.ts
var pageViewCountDimension = getEnrichmentVectorKey("$pvc", "v");
var pageViewCountEvaluator = ({ update, criteria, commands, onLogMessage }) => {
  var _a, _b;
  if (criteria.type !== "PVC") {
    return { result: false, changed: false };
  }
  const hasUrlChanged = Boolean(
    update.state.url && (!update.previousState || ((_a = update.state.url) == null ? void 0 : _a.toString()) !== ((_b = update.previousState.url) == null ? void 0 : _b.toString()))
  );
  const existingValueNumber = update.visitor.sessionScores[pageViewCountDimension] || 0;
  const updatedCount = existingValueNumber + 1;
  const finalResult = { result: false, changed: hasUrlChanged };
  const hasExistingPageViewIncrementCommand = commands.some(
    (c) => c.type === "modscoreS" && c.data.dimension === pageViewCountDimension
  );
  if (hasUrlChanged && !hasExistingPageViewIncrementCommand) {
    commands.push({
      type: "modscoreS",
      data: {
        dimension: pageViewCountDimension,
        delta: 1
      }
    });
  }
  if (isNumberMatch(updatedCount, criteria.match)) {
    finalResult.result = true;
  }
  onLogMessage == null ? void 0 : onLogMessage([
    "debug",
    203,
    { criteria, result: finalResult, explanation: explainNumberMatch(updatedCount, criteria.match) }
  ]);
  return finalResult;
};
pageViewCountEvaluator.alwaysExecute = true;

// src/manifest/signals/criteria/evaluators/queryStringEvaluator.ts
var queryStringEvaluator = ({ update, criteria, onLogMessage }) => {
  var _a, _b, _c, _d, _e;
  if (criteria.type !== "QS") {
    return { result: false, changed: false };
  }
  const hasQueryChanged = !update.previousState || ((_b = (_a = update.state.url) == null ? void 0 : _a.searchParams) == null ? void 0 : _b.toString()) !== ((_d = (_c = update.previousState.url) == null ? void 0 : _c.searchParams) == null ? void 0 : _d.toString());
  const value = (_e = update.state.url) == null ? void 0 : _e.searchParams.get(criteria.queryName);
  const result = isStringMatch(value, criteria.match);
  const finalResult = { result, changed: hasQueryChanged };
  onLogMessage == null ? void 0 : onLogMessage([
    "debug",
    203,
    { criteria, result: finalResult, explanation: explainStringMatch(value, criteria.match) }
  ]);
  return finalResult;
};

// src/manifest/signals/criteria/evaluators/quirkEvaluator.ts
var quirkEvaluator = ({ update, criteria, signal, onLogMessage }) => {
  var _a;
  if (criteria.type !== "QK") {
    return { result: false, changed: false };
  }
  if (typeof document === "undefined" && update.scores[signal.id] > 0) {
    return { result: true, changed: false };
  }
  const visitorValue = update.visitor.quirks[criteria.key];
  const updateValue = (_a = update.state.quirks) == null ? void 0 : _a[criteria.key];
  const value = updateValue != null ? updateValue : visitorValue;
  const changed = Boolean(updateValue && visitorValue !== updateValue);
  const result = isStringMatch(value, criteria.match);
  const finalResult = { result, changed };
  onLogMessage == null ? void 0 : onLogMessage([
    "debug",
    203,
    { criteria, result: finalResult, explanation: explainStringMatch(value, criteria.match) }
  ]);
  return finalResult;
};

// src/manifest/signals/criteria/GroupCriteriaEvaluator.ts
var _evaluators;
var GroupCriteriaEvaluator = class {
  constructor(criteriaEvaluators) {
    __privateAdd(this, _evaluators, void 0);
    __privateSet(this, _evaluators, criteriaEvaluators);
  }
  evaluate(update, crit, commands, signal, onLogMessage) {
    const hasMultipleClauses = crit.clauses.length > 1;
    if (hasMultipleClauses) {
      onLogMessage == null ? void 0 : onLogMessage(["debug", 202, "GROUP", crit]);
    }
    try {
      const earlyExitEvaluatorResult = crit.op === "&" || !crit.op ? false : true;
      let earlyExitResult = null;
      let isAnyChanged = false;
      for (const criteria of crit.clauses) {
        let result;
        if (criteria.type === "G") {
          result = this.evaluate(update, criteria, commands, signal, onLogMessage);
        } else {
          const evaluator = __privateGet(this, _evaluators)[criteria.type];
          if (earlyExitResult && !evaluator.alwaysExecute) {
            continue;
          }
          if (!evaluator) {
            throw new Error(`${criteria.type} signal criteria not registered`);
          }
          result = evaluator({ update, criteria, commands, signal, onLogMessage });
        }
        if (result.changed) {
          isAnyChanged = true;
        }
        if (!earlyExitResult && result.result === earlyExitEvaluatorResult) {
          earlyExitResult = { result: earlyExitEvaluatorResult, changed: isAnyChanged };
        }
      }
      const finalResult = earlyExitResult != null ? earlyExitResult : { result: !earlyExitEvaluatorResult, changed: isAnyChanged };
      if (hasMultipleClauses) {
        onLogMessage == null ? void 0 : onLogMessage(["debug", 204, finalResult]);
      }
      return finalResult;
    } finally {
      if (hasMultipleClauses) {
        onLogMessage == null ? void 0 : onLogMessage(["debug", 202, "ENDGROUP"]);
      }
    }
  }
};
_evaluators = new WeakMap();

// src/placement/criteria/evaluateVariantMatch.ts
function evaluateVariantMatch(variantId, match, vec, onLogMessage) {
  onLogMessage == null ? void 0 : onLogMessage(["info", 301, "GROUP", { id: variantId, op: match == null ? void 0 : match.op }]);
  let result;
  try {
    if (!(match == null ? void 0 : match.crit)) {
      onLogMessage == null ? void 0 : onLogMessage(["info", 302, { matched: true, description: "default variation" }]);
      result = true;
    } else if (!match.op || match.op === "&") {
      result = match.crit.every((c) => evaluateDimensionMatch(c, vec, onLogMessage));
    } else {
      result = match.crit.some((c) => evaluateDimensionMatch(c, vec, onLogMessage));
    }
    onLogMessage == null ? void 0 : onLogMessage(["info", 303, result]);
  } finally {
    onLogMessage == null ? void 0 : onLogMessage(["info", 301, "ENDGROUP"]);
  }
  return result;
}
function evaluateDimensionMatch(crit, vec, onLogMessage) {
  var _a, _b;
  const { op, l: lhs } = crit;
  const lhsScore = (_a = vec[lhs]) != null ? _a : 0;
  if (op === "+") {
    const result = Math.max(...Object.values(vec)) === lhsScore && lhsScore > 0;
    onLogMessage == null ? void 0 : onLogMessage([
      "info",
      302,
      {
        matched: result,
        description: `${crit.l} has the highest score`
      }
    ]);
    return result;
  } else if (op === "-") {
    const result = Math.min(...Object.values(vec)) === lhsScore && lhsScore > 0;
    onLogMessage == null ? void 0 : onLogMessage([
      "info",
      302,
      {
        matched: result,
        description: `${crit.l} has the lowest non-zero score`
      }
    ]);
    return result;
  }
  let rhsScore;
  if (crit.rDim) {
    rhsScore = vec[crit.rDim] || 0;
  } else {
    rhsScore = parseInt(crit.r, 10);
  }
  if (isNaN(rhsScore)) {
    onLogMessage == null ? void 0 : onLogMessage([
      "info",
      302,
      {
        matched: false,
        description: `${(_b = crit.rDim) != null ? _b : crit.r} has no score value`
      }
    ]);
    return false;
  }
  if (op === ">") {
    const result = lhsScore > rhsScore;
    explain(onLogMessage, result, crit, lhsScore, rhsScore);
    return result;
  } else if (op === ">=") {
    const result = lhsScore >= rhsScore;
    explain(onLogMessage, result, crit, lhsScore, rhsScore);
    return result;
  } else if (op === "<") {
    const result = lhsScore < rhsScore;
    explain(onLogMessage, result, crit, lhsScore, rhsScore);
    return result;
  } else if (op === "<=") {
    const result = lhsScore <= rhsScore;
    explain(onLogMessage, result, crit, lhsScore, rhsScore);
    return result;
  } else if (op === "=") {
    const result = lhsScore === rhsScore;
    explain(onLogMessage, result, crit, lhsScore, rhsScore);
    return result;
  } else if (op === "!=") {
    const result = lhsScore !== rhsScore;
    explain(onLogMessage, result, crit, lhsScore, rhsScore);
    return result;
  } else {
    throw new Error(`Unknown op: ${op}`);
  }
}
function explain(onLogMessage, result, crit, lhsScore, rhsScore) {
  onLogMessage == null ? void 0 : onLogMessage([
    "info",
    302,
    {
      matched: result,
      description: `${crit.l}[${lhsScore}] ${crit.op} ${crit.rDim ? `${crit.rDim}[${rhsScore}]` : crit.r}`
    }
  ]);
}

// src/placement/personalize.ts
function personalizeVariations({
  name,
  context,
  variations,
  take = 1,
  onLogMessage
}) {
  var _a, _b, _c;
  onLogMessage == null ? void 0 : onLogMessage(["info", 300, "GROUP", { name, take }]);
  try {
    const control = (_a = context.storage.data.controlGroup) != null ? _a : false;
    const results = [];
    let personalized = false;
    const scores = context.scores;
    for (const variant of variations) {
      if (results.length === take) {
        break;
      }
      if (!((_b = variant.pz) == null ? void 0 : _b.crit.length)) {
        onLogMessage == null ? void 0 : onLogMessage(["info", 301, "GROUP", { id: variant.id, op: (_c = variant.pz) == null ? void 0 : _c.op }]);
        onLogMessage == null ? void 0 : onLogMessage(["info", 302, { matched: true, description: "default variation" }]);
        onLogMessage == null ? void 0 : onLogMessage(["info", 303, true]);
        onLogMessage == null ? void 0 : onLogMessage(["info", 301, "ENDGROUP"]);
        results.push(variant);
        continue;
      }
      if (control) {
        continue;
      }
      if (evaluateVariantMatch(variant.id, variant.pz, scores, onLogMessage)) {
        personalized = true;
        results.push(variant);
      }
    }
    return {
      personalized,
      variations: results
    };
  } finally {
    onLogMessage == null ? void 0 : onLogMessage(["info", 300, "ENDGROUP"]);
  }
}

// src/placement/test.ts
var normalizeVariationDistributions = (variations) => {
  const { values, total, missingDistribution } = variations.reduce(
    (previous, current) => {
      if (current.testDistribution) {
        previous.total += current.testDistribution;
      } else {
        ++previous.missingDistribution;
      }
      previous.values.push(current.testDistribution);
      return previous;
    },
    {
      values: [],
      total: 0,
      missingDistribution: 0
    }
  );
  if (total > 100) {
    throw new Error(`Total distribution ${total} is over the maximum 100.`);
  } else if (total < 100) {
    const remainder = 100 - total;
    const missingSlice = remainder / missingDistribution;
    values.forEach((value, index) => {
      if (typeof value === "undefined") {
        values[index] = missingSlice;
      }
    });
  }
  return values;
};
var testVariations = ({
  name,
  context,
  variations,
  onLogMessage
}) => {
  onLogMessage == null ? void 0 : onLogMessage(["info", 400, "GROUP", name]);
  try {
    let selectedVariant;
    const selectedVariantId = context.getTestVariantId(name);
    if (selectedVariantId === null) {
      onLogMessage == null ? void 0 : onLogMessage(["error", 401, name]);
      return { result: void 0, variantAssigned: false };
    }
    if (selectedVariantId) {
      selectedVariant = variations.find((variation) => variation.id === selectedVariantId);
      if (!selectedVariant) {
        onLogMessage == null ? void 0 : onLogMessage([
          "warn",
          402,
          { missingVariant: selectedVariantId, variants: variations.map((v) => v.id) }
        ]);
      }
    }
    if (!selectedVariant) {
      const distributions = normalizeVariationDistributions(variations);
      const random = Math.floor(Math.random() * 100);
      let distributionOffset = 0;
      selectedVariant = variations.find((variant, index) => {
        const distribution = distributions[index];
        if (random > distributionOffset && random <= distributionOffset + distribution) {
          return variant;
        }
        distributionOffset += distribution;
      });
      if (selectedVariant) {
        onLogMessage == null ? void 0 : onLogMessage(["info", 403, selectedVariant.id]);
        context.setTestVariantId(name, selectedVariant.id);
      }
    }
    if (selectedVariant) {
      onLogMessage == null ? void 0 : onLogMessage(["info", 404, selectedVariant.id]);
    }
    return {
      result: selectedVariant,
      variantAssigned: !selectedVariantId
    };
  } finally {
    onLogMessage == null ? void 0 : onLogMessage(["info", 400, "ENDGROUP"]);
  }
};

// src/storage/CookieTransitionDataStore.ts
var import_js_cookie = __toESM(require("js-cookie"));

// src/storage/TransitionDataStore.ts
var import_lite2 = require("dequal/lite");
var import_mitt = __toESM(require("mitt"));
var SERVER_STATE_ID = "__UNIFORM_DATA__";
var _data, _initialData, _mitt;
var TransitionDataStore = class {
  constructor({ initialData }) {
    __privateAdd(this, _data, void 0);
    __privateAdd(this, _initialData, void 0);
    __privateAdd(this, _mitt, (0, import_mitt.default)());
    /**
     * Subscribe to events from the transition storage
     */
    __publicField(this, "events", {
      on: __privateGet(this, _mitt).on,
      off: __privateGet(this, _mitt).off
    });
    if (initialData) {
      __privateSet(this, _data, initialData);
      __privateSet(this, _initialData, initialData);
    }
  }
  get data() {
    return __privateGet(this, _data);
  }
  get initialData() {
    return __privateGet(this, _initialData);
  }
  /**
   * Updates data in the transition storage.
   * @param commands Commands to execute against existing stored value (event based stores)
   * @param computedValue Pre-computed new value against existing value (object based stores)
   * @returns Resolved promise when the data has been updated
   */
  updateData(commands, computedValue) {
    __privateSet(this, _data, computedValue);
    return this.handleUpdateData(commands, computedValue);
  }
  /**
   * Deletes a visitor's stored data, forgetting them.
   * @param fromAllDevices - false: logout from this device ID. true: forget all data about the visitor and their identity.
   */
  async delete(fromAllDevices) {
    __privateSet(this, _data, void 0);
    await this.handleDelete(fromAllDevices);
  }
  signalAsyncDataUpdate(newScores) {
    if ((0, import_lite2.dequal)(this.data, newScores)) {
      return;
    }
    __privateSet(this, _data, newScores);
    __privateGet(this, _mitt).emit("dataUpdatedAsync", newScores);
  }
  /**
   * When we load on the client side after a server side rendering has occurred (server to client transition),
   * we can have a page script (ID: __UNIFORM_DATA__) that contains the computed visitor data from the SSR/edge render.
   * This data is injected into the first render to allow score syncing and the server to request commands be applied
   * to the client side data store.
   */
  getClientTransitionState() {
    if (typeof document === "undefined") {
      return;
    }
    const matchesElement = document.getElementById(SERVER_STATE_ID);
    return (matchesElement == null ? void 0 : matchesElement.textContent) ? JSON.parse(matchesElement.textContent) : void 0;
  }
};
_data = new WeakMap();
_initialData = new WeakMap();
_mitt = new WeakMap();

// src/storage/util/numberToBase64.ts
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b2s = alphabet.split("");
var s2b = new Array(123);
for (let i = 0; i < alphabet.length; i++) {
  s2b[alphabet.charCodeAt(i)] = i;
}
var ntob = (number) => {
  if (number < 0)
    return `-${ntob(-number)}`;
  let lo = number >>> 0;
  let hi = number / 4294967296 >>> 0;
  let right = "";
  while (hi > 0) {
    right = b2s[63 & lo] + right;
    lo >>>= 6;
    lo |= (63 & hi) << 26;
    hi >>>= 6;
  }
  let left = "";
  do {
    left = b2s[63 & lo] + left;
    lo >>>= 6;
  } while (lo > 0);
  return left + right;
};
var bton = (base64) => {
  let number = 0;
  const sign = base64.charAt(0) === "-" ? 1 : 0;
  for (let i = sign; i < base64.length; i++) {
    number = number * 64 + s2b[base64.charCodeAt(i)];
  }
  return sign ? -number : number;
};

// src/storage/CookieTransitionDataStore.ts
var ssr = typeof document === "undefined";
var UNIFORM_DEFAULT_COOKIE_NAME = "ufvd";
var _cookieName, _cookieAttributes;
var CookieTransitionDataStore = class extends TransitionDataStore {
  constructor({
    serverCookieValue,
    cookieName = UNIFORM_DEFAULT_COOKIE_NAME,
    cookieAttributes = { sameSite: "lax" }
  }) {
    super({
      initialData: ssr ? parseScoreCookie(serverCookieValue) : void 0
    });
    __privateAdd(this, _cookieName, void 0);
    __privateAdd(this, _cookieAttributes, void 0);
    __privateSet(this, _cookieName, cookieName);
    __privateSet(this, _cookieAttributes, cookieAttributes);
  }
  handleDelete() {
    if (ssr)
      return Promise.resolve();
    import_js_cookie.default.remove(__privateGet(this, _cookieName));
    return Promise.resolve();
  }
  async handleUpdateData(_, computedValue) {
    if (ssr)
      return;
    if (computedValue.consent) {
      import_js_cookie.default.set(__privateGet(this, _cookieName), serializeCookie(computedValue), __privateGet(this, _cookieAttributes));
    } else {
      import_js_cookie.default.remove(__privateGet(this, _cookieName));
    }
  }
};
_cookieName = new WeakMap();
_cookieAttributes = new WeakMap();
var TYPE_SEP = "~";
var PAIR_SEP = "!";
var KV_SEP = "-";
function parseScoreCookie(cookieValue) {
  if (!cookieValue)
    return;
  const types = cookieValue.split(TYPE_SEP);
  if (types.length > 3)
    return;
  const [abTestData, sessionScores, visitorScores] = types;
  return {
    // this is true since we're reading a cookie, which wouldn't exist if consent wasn't given
    consent: true,
    sessionScores: decodeCookieType(parseCookieType(sessionScores)),
    scores: decodeCookieType(parseCookieType(visitorScores)),
    tests: parseCookieType(abTestData)
  };
}
function parseCookieType(type) {
  if (!type) {
    return {};
  }
  const pairs = type.split(PAIR_SEP).map((pair) => pair.split(KV_SEP));
  return pairs.reduce((acc, cur) => {
    if (cur.length < 2)
      return acc;
    acc[cur[0]] = cur.slice(1).join("-");
    return acc;
  }, {});
}
function decodeCookieType(type) {
  return Object.entries(type).reduce((acc, [key, value]) => {
    acc[key] = bton(value);
    return acc;
  }, {});
}
function serializeCookie(data) {
  return [
    serializeCookieType(data.tests),
    serializeCookieType(encodeCookieType(data.sessionScores)),
    serializeCookieType(encodeCookieType(data.scores))
  ].join(TYPE_SEP);
}
function encodeCookieType(type) {
  return Object.entries(type).reduce((acc, [key, value]) => {
    acc[key] = ntob(value);
    return acc;
  }, {});
}
function serializeCookieType(type) {
  return Object.entries(type).map((kv) => kv.join(KV_SEP)).join(PAIR_SEP);
}

// src/storage/EdgeTransitionDataStore.ts
var _fetchData, fetchData_fn;
var EdgeTransitionDataStore = class extends TransitionDataStore {
  constructor({ serverCookieValue, visitorIdCookieName = "ufvi", ...base }) {
    super(base);
    __privateAdd(this, _fetchData);
    if (!base.initialData) {
      __privateMethod(this, _fetchData, fetchData_fn).call(this).catch((err) => {
        console.error(err);
      });
    }
  }
  handleDelete(fromAllDevices) {
    throw new Error("Method not implemented.");
  }
  async handleUpdateData(commands) {
    const commandResults = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(void 0);
      }, 2e3);
    });
    if (commandResults) {
      this.signalAsyncDataUpdate(commandResults);
    }
  }
};
_fetchData = new WeakSet();
fetchData_fn = async function() {
  const serviceData = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(void 0);
    }, 2e3);
  });
  if (serviceData) {
    this.signalAsyncDataUpdate(serviceData);
  }
};

// src/storage/linearDecay.ts
function createLinearDecay(options) {
  const { gracePeriod = 864e5, decayRate = 1 / 30, decayCap = 0.95 } = options != null ? options : {};
  return function linearDecay({ now, lastUpd, scores, sessionScores, onLogMessage }) {
    if (typeof lastUpd !== "number") {
      return false;
    }
    const timeSinceLastUpdate = now - lastUpd;
    const timeSinceGracePeriod = timeSinceLastUpdate - gracePeriod;
    if (timeSinceGracePeriod <= 0) {
      return false;
    }
    const timeSinceGracePeriodInDays = timeSinceGracePeriod / 864e5;
    const decayFactor = 1 - Math.min(decayCap, timeSinceGracePeriodInDays * decayRate);
    if (decayFactor <= 0) {
      return false;
    }
    decayVector(scores, decayFactor);
    decayVector(sessionScores, decayFactor);
    onLogMessage == null ? void 0 : onLogMessage(["info", 140, `linear decay factor ${decayFactor.toPrecision(6)}`]);
    return true;
  };
}
function decayVector(vector, decay) {
  for (const key in vector) {
    if (key.startsWith("$")) {
      continue;
    }
    vector[key] *= decay;
  }
}

// src/types.ts
var emptyVisitorData = () => ({
  quirks: {},
  scores: {},
  sessionScores: {},
  tests: {},
  consent: false,
  controlGroup: false
});

// src/storage/VisitorDataStore.ts
var import_lite3 = require("dequal/lite");
var import_mitt2 = __toESM(require("mitt"));

// src/storage/util/applyCommandsToData.ts
var import_rfdc = __toESM(require("rfdc"));
var clone = (0, import_rfdc.default)();
function applyCommandsToData(commands, state, inControlGroup) {
  const newData = state ? clone(state) : emptyVisitorData();
  commands.forEach((command) => {
    var _a, _b;
    switch (command.type) {
      case "consent":
        newData.consent = command.data;
        break;
      case "setquirk":
        newData.quirks[command.data.key] = command.data.value;
        break;
      case "settest":
        newData.tests[command.data.test] = command.data.variant;
        break;
      case "modscore":
        if (inControlGroup)
          break;
        const delta = Number(command.data.delta);
        if (isNaN(delta)) {
          throw new Error("Non-number delta received");
        }
        const existing = (_a = newData.scores[command.data.dimension]) != null ? _a : 0;
        newData.scores[command.data.dimension] = existing + delta;
        break;
      case "modscoreS":
        if (inControlGroup)
          break;
        const deltaS = Number(command.data.delta);
        if (isNaN(deltaS)) {
          throw new Error("Non-number delta received");
        }
        const existingS = (_b = newData.sessionScores[command.data.dimension]) != null ? _b : 0;
        newData.sessionScores[command.data.dimension] = existingS + deltaS;
        break;
      case "identify":
        break;
      case "setcontrol":
        newData.controlGroup = command.data;
        break;
      default:
        throw new Error(`Unknown command`);
    }
  });
  return newData;
}

// src/storage/util/LocalStorage.ts
var LocalStorage = class {
  constructor() {
    __publicField(this, "inMemoryFallback", {});
    __publicField(this, "hasLocalStorageObject", typeof localStorage !== "undefined");
  }
  get(key) {
    const fallbackValue = this.inMemoryFallback[key];
    if (!this.hasLocalStorageObject || fallbackValue) {
      return fallbackValue;
    }
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : void 0;
    } catch (e) {
      return fallbackValue;
    }
  }
  set(key, value, storageConsent) {
    this.inMemoryFallback[key] = value;
    if (!this.hasLocalStorageObject || !storageConsent) {
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(e);
    }
  }
  delete(key, leaveInMemory) {
    if (!leaveInMemory) {
      delete this.inMemoryFallback[key];
    }
    try {
      localStorage.removeItem(key);
    } catch (e) {
    }
  }
};

// src/storage/VisitorDataStore.ts
var STORAGE_KEY = "ufvisitor";
var _mitt2, _persist, _visitTimeout, _options, _currentData, currentData_get, _replaceData, replaceData_fn, _setVisitTimeout, setVisitTimeout_fn, _isExpired, isExpired_fn, _handleCaps, handleCaps_fn, _defaultData, defaultData_fn;
var VisitorDataStore = class {
  constructor(options) {
    /** Gets the current client-side storage data. This property is always up to date. */
    __privateAdd(this, _currentData);
    /**
     * IMPORTANT: This function mutates the input data. This is done,
     * because all the sources that call it have either already spread or cloned
     * the data, so we can safely mutate it for better perf.
     */
    __privateAdd(this, _replaceData);
    __privateAdd(this, _setVisitTimeout);
    __privateAdd(this, _isExpired);
    /**
     * IMPORTANT: This function mutates the input data. This is done,
     * because all the sources that call it have either already spread or cloned
     * the data, so we can safely mutate it for better perf.
     */
    __privateAdd(this, _handleCaps);
    __privateAdd(this, _defaultData);
    __privateAdd(this, _mitt2, (0, import_mitt2.default)());
    __privateAdd(this, _persist, new LocalStorage());
    __privateAdd(this, _visitTimeout, void 0);
    __privateAdd(this, _options, void 0);
    /**
     * Subscribe to events from storage
     */
    __publicField(this, "events", {
      on: __privateGet(this, _mitt2).on,
      off: __privateGet(this, _mitt2).off
    });
    __privateSet(this, _options, options);
    if (!__privateGet(this, _currentData, currentData_get)) {
      __privateMethod(this, _replaceData, replaceData_fn).call(this, __privateMethod(this, _defaultData, defaultData_fn).call(this), true);
    }
    if (options.transitionStore) {
      const serverToClientTransitionState = options.transitionStore.getClientTransitionState();
      if (serverToClientTransitionState && options.onServerTransitionReceived) {
        options.onServerTransitionReceived(serverToClientTransitionState);
      }
      options.transitionStore.events.on("dataUpdatedAsync", (data) => {
        __privateMethod(this, _replaceData, replaceData_fn).call(this, {
          ...__privateGet(this, _currentData, currentData_get).visitorData,
          ...data
        });
      });
      const transitionData = options.transitionStore.data;
      if (transitionData) {
        __privateMethod(this, _replaceData, replaceData_fn).call(
          this,
          // we know _currentData is not empty because we inited it above if it was
          { ...__privateGet(this, _currentData, currentData_get).visitorData, ...transitionData },
          true
        );
      }
    }
  }
  /** Gets the current visitor data. This property is always up to date. */
  get data() {
    var _a, _b;
    const data = __privateGet(this, _currentData, currentData_get);
    if (__privateMethod(this, _isExpired, isExpired_fn).call(this, data)) {
      const { sessionScores, ...newData } = data.visitorData;
      __privateMethod(this, _replaceData, replaceData_fn).call(this, { ...newData, sessionScores: {} });
      (_b = (_a = __privateGet(this, _options)).onLogMessage) == null ? void 0 : _b.call(_a, ["info", 120]);
      return __privateGet(this, _currentData, currentData_get).visitorData;
    }
    return data.visitorData;
  }
  get decayEnabled() {
    return !!__privateGet(this, _options).decay;
  }
  get options() {
    return __privateGet(this, _options);
  }
  /** Push data update command(s) into the visitor data */
  async updateData(commands) {
    var _a, _b, _c, _d;
    if (commands.length === 0) {
      return;
    }
    (_b = (_a = __privateGet(this, _options)).onLogMessage) == null ? void 0 : _b.call(_a, ["debug", 101, commands]);
    const newData = applyCommandsToData(commands, this.data, (_c = __privateGet(this, _currentData, currentData_get)) == null ? void 0 : _c.visitorData.controlGroup);
    if (commands.some((c) => c.type === "consent" && !c.data)) {
      __privateGet(this, _persist).delete(STORAGE_KEY, true);
    }
    __privateMethod(this, _replaceData, replaceData_fn).call(this, newData);
    await ((_d = __privateGet(this, _options).transitionStore) == null ? void 0 : _d.updateData(commands, __privateGet(this, _currentData, currentData_get).visitorData));
  }
  /**
   * Deletes visitor data (forgetting them)
   * In most cases you should use forget() on the Context instead of this function, which also clears the Context state.
   * @param fromAllDevices for an identified user, whether to delete all their data (for the entire account) - true, or data for this device (sign out) - false
   */
  async delete(fromAllDevices) {
    var _a, _b, _c, _d, _e;
    (_b = (_a = __privateGet(this, _options)).onLogMessage) == null ? void 0 : _b.call(_a, ["info", 103, "GROUP", fromAllDevices]);
    try {
      __privateGet(this, _persist).delete(STORAGE_KEY, false);
      await ((_c = __privateGet(this, _options).transitionStore) == null ? void 0 : _c.delete(fromAllDevices));
      __privateMethod(this, _replaceData, replaceData_fn).call(this, __privateMethod(this, _defaultData, defaultData_fn).call(this));
    } finally {
      (_e = (_d = __privateGet(this, _options)).onLogMessage) == null ? void 0 : _e.call(_d, ["info", 103, "ENDGROUP"]);
    }
  }
};
_mitt2 = new WeakMap();
_persist = new WeakMap();
_visitTimeout = new WeakMap();
_options = new WeakMap();
_currentData = new WeakSet();
currentData_get = function() {
  return __privateGet(this, _persist).get(STORAGE_KEY);
};
_replaceData = new WeakSet();
replaceData_fn = function(data, quiet = false) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const oldData = __privateGet(this, _currentData, currentData_get);
  const now = Date.now();
  if (data.controlGroup) {
    data.scores = {};
    data.sessionScores = {};
  } else {
    __privateMethod(this, _handleCaps, handleCaps_fn).call(this, data.scores);
    __privateMethod(this, _handleCaps, handleCaps_fn).call(this, data.sessionScores);
    (_b = (_a = __privateGet(this, _options)).decay) == null ? void 0 : _b.call(_a, {
      now,
      lastUpd: oldData == null ? void 0 : oldData.updated,
      scores: data.scores,
      sessionScores: data.sessionScores,
      onLogMessage: __privateGet(this, _options).onLogMessage
    });
  }
  const haveScoresChanged = !(0, import_lite3.dequal)(oldData == null ? void 0 : oldData.visitorData.scores, data.scores);
  const haveSessionScoresChanged = !(0, import_lite3.dequal)(oldData == null ? void 0 : oldData.visitorData.sessionScores, data.sessionScores);
  const haveQuirksChanged = !(0, import_lite3.dequal)(oldData == null ? void 0 : oldData.visitorData.quirks, data.quirks);
  const haveTestsChanged = !(0, import_lite3.dequal)(oldData == null ? void 0 : oldData.visitorData.tests, data.tests);
  const updatedData = {
    updated: now,
    visitorData: data
  };
  __privateMethod(this, _setVisitTimeout, setVisitTimeout_fn).call(this);
  __privateGet(this, _persist).set(STORAGE_KEY, updatedData, !!data.consent);
  (_d = (_c = __privateGet(this, _options)).onLogMessage) == null ? void 0 : _d.call(_c, ["debug", 102, data]);
  if (!quiet) {
    if (haveScoresChanged || haveSessionScoresChanged) {
      __privateGet(this, _mitt2).emit("scoresUpdated", data);
    }
    if (haveQuirksChanged) {
      __privateGet(this, _mitt2).emit("quirksUpdated", data);
    }
    if (haveTestsChanged) {
      __privateGet(this, _mitt2).emit("testsUpdated", data);
    }
    if (((_e = oldData == null ? void 0 : oldData.visitorData) == null ? void 0 : _e.consent) !== data.consent) {
      __privateGet(this, _mitt2).emit("consentUpdated", data);
    }
    if (((_f = oldData == null ? void 0 : oldData.visitorData) == null ? void 0 : _f.controlGroup) !== data.controlGroup) {
      __privateGet(this, _mitt2).emit("controlGroupUpdated", data);
      (_i = (_h = __privateGet(this, _options)).onLogMessage) == null ? void 0 : _i.call(_h, ["debug", 104, (_g = data.controlGroup) != null ? _g : false]);
    }
  }
};
_setVisitTimeout = new WeakSet();
setVisitTimeout_fn = function() {
  if (typeof document === "undefined" || !__privateGet(this, _options).visitLifespan) {
    return;
  }
  if (__privateGet(this, _visitTimeout)) {
    window.clearTimeout(__privateGet(this, _visitTimeout));
  }
  __privateSet(this, _visitTimeout, window.setTimeout(() => {
    this.data;
  }, __privateGet(this, _options).visitLifespan + 50));
};
_isExpired = new WeakSet();
isExpired_fn = function(data) {
  const expires = __privateGet(this, _options).visitLifespan;
  return expires ? data.updated + expires < Date.now() : false;
};
_handleCaps = new WeakSet();
handleCaps_fn = function(scores) {
  var _a, _b;
  if (!__privateGet(this, _options).manifest) {
    return;
  }
  for (const dim in scores) {
    const score = scores[dim];
    const dimDef = __privateGet(this, _options).manifest.getDimensionByKey(dim);
    if (!dimDef) {
      continue;
    }
    if (score > dimDef.cap) {
      (_b = (_a = __privateGet(this, _options)).onLogMessage) == null ? void 0 : _b.call(_a, ["debug", 110, { dim, score, cap: dimDef.cap }]);
      scores[dim] = dimDef.cap;
    }
  }
};
_defaultData = new WeakSet();
defaultData_fn = function() {
  var _a, _b, _c;
  return {
    ...emptyVisitorData(),
    consent: (_a = __privateGet(this, _options).defaultConsent) != null ? _a : false,
    controlGroup: (_c = (_b = __privateGet(this, _options).manifest) == null ? void 0 : _b.rollForControlGroup()) != null ? _c : false
  };
};

// src/Context.ts
var import_lite4 = require("dequal/lite");
var import_mitt3 = __toESM(require("mitt"));
var CONTEXTUAL_EDITING_TEST_NAME = "contextual_editing_test";
var CONTEXTUAL_EDITING_TEST_SELECTED_VARIANT_ID = "contextual_editing_test_selected_variant";
var _serverTransitionState, _scores, _state, _pzCache, _mitt3, _emitTest, emitTest_fn, _updateComputedScores, updateComputedScores_fn, _calculateScores, calculateScores_fn;
var Context = class {
  constructor(options) {
    __privateAdd(this, _emitTest);
    __privateAdd(this, _updateComputedScores);
    __privateAdd(this, _calculateScores);
    __publicField(this, "manifest");
    __privateAdd(this, _serverTransitionState, void 0);
    __privateAdd(this, _scores, {});
    __privateAdd(this, _state, void 0);
    __privateAdd(this, _pzCache, {});
    __privateAdd(this, _mitt3, (0, import_mitt3.default)());
    /**
     * Subscribe to events
     */
    __publicField(this, "events", {
      on: __privateGet(this, _mitt3).on,
      off: __privateGet(this, _mitt3).off
    });
    __publicField(this, "storage");
    var _a, _b;
    const { manifest, ...storageOptions } = options;
    __privateSet(this, _state, {});
    (_a = options.plugins) == null ? void 0 : _a.forEach((plugin) => {
      if (!plugin.logDrain) {
        return;
      }
      __privateGet(this, _mitt3).on("log", plugin.logDrain);
    });
    __privateGet(this, _mitt3).emit("log", ["info", 1, "GROUP"]);
    try {
      this.manifest = new ManifestInstance({
        onLogMessage: (message) => __privateGet(this, _mitt3).emit("log", message),
        manifest,
        evaluator: new GroupCriteriaEvaluator({
          CK: cookieEvaluator,
          QS: queryStringEvaluator,
          QK: quirkEvaluator,
          PVC: pageViewCountEvaluator,
          EVT: eventEvaluator,
          PV: currentPageEvaluator
        })
      });
      this.storage = new VisitorDataStore({
        ...storageOptions,
        manifest: this.manifest,
        onServerTransitionReceived: (state) => {
          __privateSet(this, _serverTransitionState, state);
          if (state.ssv) {
            __privateSet(this, _scores, state.ssv);
            __privateGet(this, _mitt3).emit("log", ["debug", 130, state]);
          }
        },
        onLogMessage: (message) => __privateGet(this, _mitt3).emit("log", message)
      });
      this.storage.events.on("scoresUpdated", __privateMethod(this, _updateComputedScores, updateComputedScores_fn).bind(this));
      if (!__privateGet(this, _serverTransitionState)) {
        __privateMethod(this, _updateComputedScores, updateComputedScores_fn).call(this, this.storage.data);
      }
      this.storage.events.on("quirksUpdated", (quirks) => {
        const updates = this.manifest.computeSignals({
          scores: __privateGet(this, _scores),
          state: __privateGet(this, _state),
          previousState: __privateGet(this, _state),
          visitor: this.storage.data
        });
        this.storage.updateData(updates);
        __privateGet(this, _mitt3).emit("quirksUpdated", quirks.quirks);
        __privateGet(this, _mitt3).emit("log", ["info", 4, quirks.quirks]);
      });
      (_b = options.plugins) == null ? void 0 : _b.forEach((plugin) => {
        if (!plugin.init) {
          return;
        }
        plugin.init(this);
      });
    } finally {
      __privateGet(this, _mitt3).emit("log", ["info", 1, "ENDGROUP"]);
    }
  }
  /** Gets the current visitor's dimension score vector. */
  get scores() {
    return __privateGet(this, _scores);
  }
  /** Gets the current visitor's quirks values. */
  get quirks() {
    var _a, _b;
    return (_b = (_a = __privateGet(this, _serverTransitionState)) == null ? void 0 : _a.quirks) != null ? _b : this.storage.data.quirks;
  }
  /**
   * Updates the Context with new data of any sort, such as
   * new URLs, cookies, quirks, and enrichments.
   *
   * Only properties that are set in the data parameter will be updated.
   * Properties that do not result in a changed state,
   * i.e. pushing the same URL or cookies as before,
   * will NOT result in a recomputation of signal state.
   */
  async update(newData) {
    var _a, _b, _c;
    const commands = [];
    const newServerSideTests = {};
    if ((_a = __privateGet(this, _serverTransitionState)) == null ? void 0 : _a.quirks) {
      newData = {
        ...newData,
        quirks: {
          ...__privateGet(this, _serverTransitionState).quirks,
          ...newData.quirks || {}
        }
      };
    }
    if ((_b = __privateGet(this, _serverTransitionState)) == null ? void 0 : _b.tests) {
      const testEntries = Object.entries(__privateGet(this, _serverTransitionState).tests);
      if (testEntries.length > 0) {
        const validTests = [];
        testEntries.forEach(([testName, testVariantId]) => {
          if (!this.storage.data.tests[testName]) {
            validTests.push([testName, testVariantId]);
            newServerSideTests[testName] = testVariantId;
          }
        });
        commands.push(
          ...validTests.map(([key, value]) => ({
            type: "settest",
            data: { test: key, variant: value }
          }))
        );
      }
    }
    try {
      __privateGet(this, _mitt3).emit("log", [
        "info",
        2,
        "GROUP",
        {
          ...newData,
          // need to convert url to string so it can be json serialized
          // to go over postMessage to chrome extension
          url: (_c = newData.url) == null ? void 0 : _c.toString()
        }
      ]);
      if (newData.quirks) {
        commands.push(
          ...Object.entries(newData.quirks).map(([key, value]) => ({
            type: "setquirk",
            data: { key, value }
          }))
        );
      }
      if (newData.enrichments) {
        newData.enrichments.forEach((enrichment) => {
          const dimension = getEnrichmentVectorKey(enrichment.cat, enrichment.key);
          const dimData = this.manifest.getDimensionByKey(dimension);
          if (dimData) {
            commands.push({
              type: "modscore",
              data: {
                dimension,
                delta: enrichment.str
              }
            });
          } else {
            __privateGet(this, _mitt3).emit("log", ["warn", 5, enrichment]);
          }
        });
      }
      commands.push(
        ...this.manifest.computeSignals({
          state: newData,
          previousState: __privateGet(this, _state),
          visitor: this.storage.data,
          // re-compute using scores from storage instead of the current scores since
          // server transition scores might have adjusted values already integrated into them,
          // which causes issues when you are near limits.
          scores: __privateGet(this, _serverTransitionState) ? __privateMethod(this, _calculateScores, calculateScores_fn).call(this, this.storage.data) : __privateGet(this, _scores)
        })
      );
      __privateSet(this, _state, {
        ...__privateGet(this, _state),
        ...newData
      });
      await this.storage.updateData(commands);
      if (__privateGet(this, _serverTransitionState)) {
        __privateMethod(this, _updateComputedScores, updateComputedScores_fn).call(this, this.storage.data);
        Object.entries(newServerSideTests).forEach(([testName, testVariantId]) => {
          __privateMethod(this, _emitTest, emitTest_fn).call(this, {
            name: testName,
            variantId: testVariantId,
            variantAssigned: true
          });
        });
        __privateSet(this, _serverTransitionState, void 0);
        __privateGet(this, _mitt3).emit("log", ["debug", 131]);
      }
    } finally {
      __privateGet(this, _mitt3).emit("log", ["info", 2, "ENDGROUP"]);
    }
  }
  /** use test() instead */
  getTestVariantId(testName) {
    var _a, _b, _c, _d;
    const definition = this.manifest.getTest(testName);
    if (!definition) {
      __privateGet(this, _mitt3).emit("log", ["warn", 401, testName]);
      return null;
    }
    return (_d = (_c = definition.wv) != null ? _c : (_b = (_a = __privateGet(this, _serverTransitionState)) == null ? void 0 : _a.tests) == null ? void 0 : _b[testName]) != null ? _d : this.storage.data.tests[testName];
  }
  /** use test() instead */
  setTestVariantId(testName, variantId) {
    this.storage.updateData([
      {
        type: "settest",
        data: {
          test: testName,
          variant: variantId
        }
      }
    ]);
  }
  /**
   * Writes a message to the Context log sink.
   * Used by Uniform internal SDK; not intended for public use.
   */
  log(...message) {
    __privateGet(this, _mitt3).emit("log", message);
  }
  /** Executes an A/B test with a given set of variants, showing the visitor's assigned variant (or selecting one to assign, if none is set yet) */
  test(options) {
    var _a, _b, _c;
    if (options.name === CONTEXTUAL_EDITING_TEST_NAME) {
      const selectedVariant = (_a = options.variations.find((variant) => {
        variant.id === CONTEXTUAL_EDITING_TEST_SELECTED_VARIANT_ID;
      })) != null ? _a : options.variations.at(-1);
      const value2 = {
        result: selectedVariant,
        variantAssigned: false
      };
      return value2;
    }
    const value = testVariations({
      ...options,
      context: this,
      onLogMessage: (message) => __privateGet(this, _mitt3).emit("log", message)
    });
    __privateMethod(this, _emitTest, emitTest_fn).call(this, {
      name: options.name,
      variantId: (_c = (_b = value.result) == null ? void 0 : _b.id) != null ? _c : void 0,
      variantAssigned: value.variantAssigned
    });
    return value;
  }
  /** Executes a personalized placement with a given set of variants */
  personalize(options) {
    const value = personalizeVariations({
      ...options,
      context: this,
      onLogMessage: (message) => __privateGet(this, _mitt3).emit("log", message)
    });
    const previousPlacement = __privateGet(this, _pzCache)[options.name];
    const eventData = {
      name: options.name,
      variantIds: value.variations.map((variation) => {
        var _a;
        return (_a = variation.id) != null ? _a : "Unknown";
      }),
      control: this.storage.data.controlGroup,
      changed: true
    };
    if (previousPlacement && (0, import_lite4.dequal)(eventData.variantIds, previousPlacement)) {
      eventData.changed = false;
    }
    __privateGet(this, _mitt3).emit("personalizationResult", eventData);
    __privateGet(this, _pzCache)[options.name] = eventData.variantIds;
    return value;
  }
  /**
   * Forgets the visitor's data and resets the Context to its initial state.
   * @param fromAllDevices for an identified user, whether to delete all their data (for the entire account) - true, or data for this device (sign out) - false
   */
  async forget(fromAllDevices) {
    __privateSet(this, _state, {});
    await this.storage.delete(fromAllDevices);
  }
  /**
   * Computes server to client transition state.
   *
   * Removes state from server-to-client if it came in initial state (cookies) to avoid double tracking on the client.
   */
  getServerToClientTransitionState() {
    const transitionState = {
      quirks: this.storage.data.quirks,
      ssv: __privateGet(this, _scores),
      tests: {}
    };
    const allTests = this.storage.data.tests;
    Object.entries(allTests).map(([testName, testValue]) => {
      var _a, _b, _c;
      if (((_c = (_b = (_a = this.storage.options.transitionStore) == null ? void 0 : _a.initialData) == null ? void 0 : _b.tests) == null ? void 0 : _c[testName]) !== allTests[testName] && transitionState.tests) {
        transitionState.tests[testName] = testValue;
      }
    });
    return transitionState;
  }
  /** @deprecated */
  internal_processTestEvent(event) {
    if (event.variantId) {
      this.setTestVariantId(event.name, event.variantId);
      __privateMethod(this, _emitTest, emitTest_fn).call(this, event);
    }
  }
  /** @deprecated */
  internal_processPersonalizationEvent(event) {
    __privateGet(this, _pzCache)[event.name] = event.variantIds;
    __privateGet(this, _mitt3).emit("personalizationResult", event);
  }
};
_serverTransitionState = new WeakMap();
_scores = new WeakMap();
_state = new WeakMap();
_pzCache = new WeakMap();
_mitt3 = new WeakMap();
_emitTest = new WeakSet();
emitTest_fn = function(event) {
  __privateGet(this, _mitt3).emit("testResult", event);
};
_updateComputedScores = new WeakSet();
updateComputedScores_fn = function(newData) {
  const newScores = __privateMethod(this, _calculateScores, calculateScores_fn).call(this, newData);
  const newScoresHaveChanged = !(0, import_lite4.dequal)(newScores, __privateGet(this, _scores));
  if (newScoresHaveChanged) {
    __privateSet(this, _scores, newScores);
    __privateGet(this, _mitt3).emit("scoresUpdated", newScores);
    __privateGet(this, _mitt3).emit("log", ["info", 3, newScores]);
  }
};
_calculateScores = new WeakSet();
calculateScores_fn = function(newData) {
  var _a;
  let newScores = { ...newData.scores };
  for (const session in newData.sessionScores) {
    newScores[session] = ((_a = newScores[session]) != null ? _a : 0) + newData.sessionScores[session];
  }
  newScores = this.manifest.computeAggregateDimensions(newScores);
  return newScores;
};

// src/devTools/enableContextDevTools.ts
var isBrowser = typeof top !== "undefined";
function enableContextDevTools(options) {
  return {
    logDrain: (message) => {
      if (!isBrowser) {
        return;
      }
      top == null ? void 0 : top.postMessage(
        {
          type: "uniform:context:log",
          message
        },
        window.location.origin
      );
    },
    init: (context) => {
      const personalizations = [];
      const tests = [];
      const onContextDataUpdated = () => {
        if (!isBrowser) {
          return;
        }
        top == null ? void 0 : top.postMessage(
          {
            type: "uniform:context:data",
            data: {
              scores: context.scores,
              data: context.storage.data,
              manifest: context.manifest.data,
              personalizations,
              tests
            }
          },
          window.location.origin
        );
      };
      const onPersonalizationResult = (e) => {
        if (!e.changed)
          return;
        personalizations.push(e);
      };
      const onTestResult = (e) => {
        if (!e.variantAssigned)
          return;
        tests.push(e);
      };
      if (isBrowser) {
        window.__UNIFORM_DEVTOOLS_CONTEXT_INSTANCE__ = context;
        try {
          top == null ? void 0 : top.addEventListener("message", async (event) => {
            if (!event.data) {
              return;
            }
            const message = event.data;
            await handleMessageFromDevTools({
              message,
              context,
              afterMessageReceived: options == null ? void 0 : options.onAfterMessageReceived
            });
          });
        } catch (e) {
          console.warn(
            "Unable to initialize Uniform Context DevTools because it is in a cross-domain iframe.",
            e
          );
        }
        top == null ? void 0 : top.postMessage(
          {
            type: "uniform:context:hello",
            uiVersion: 2
          },
          window.location.origin
        );
        onContextDataUpdated();
      }
      context.events.on("personalizationResult", onPersonalizationResult);
      context.events.on("testResult", onTestResult);
      context.events.on("scoresUpdated", onContextDataUpdated);
      return () => {
        context.events.off("scoresUpdated", onContextDataUpdated);
        context.events.off("personalizationResult", onPersonalizationResult);
        context.events.off("testResult", onTestResult);
      };
    }
  };
}
async function handleMessageFromDevTools({
  message,
  context,
  afterMessageReceived
}) {
  let receivedUniformMessage = false;
  if (message.type === "uniform-in:context:update" && message.newData) {
    receivedUniformMessage = true;
    await context.update(message.newData);
  }
  if (message.type === "uniform-in:context:commands" && message.commands && Array.isArray(message.commands)) {
    receivedUniformMessage = true;
    await context.storage.updateData(message.commands);
  }
  if (message.type === "uniform-in:context:forget") {
    receivedUniformMessage = true;
    await context.forget(false);
  }
  if (receivedUniformMessage && typeof afterMessageReceived === "function") {
    afterMessageReceived(message);
  }
}

// src/edge/index.ts
var ScriptType = /* @__PURE__ */ ((ScriptType2) => {
  ScriptType2["ListStart"] = "nesi-list-start";
  ScriptType2["ListEnd"] = "nesi-list-end";
  ScriptType2["ListItem"] = "nesi-list-item-html";
  ScriptType2["ListItemSettings"] = "nesi-list-item-settings";
  ScriptType2["TestStart"] = "nesi-test-start";
  ScriptType2["TestEnd"] = "nesi-test-end";
  ScriptType2["Unknown"] = "unknown";
  return ScriptType2;
})(ScriptType || {});
var EdgeNodeTagName = "nesitag";

// src/logging/enableConsoleLogDrain.ts
var import_rfdc2 = __toESM(require("rfdc"));

// src/logging/isEnabled.ts
function isEnabled(level, severity) {
  if (level === "none") {
    return false;
  }
  switch (severity) {
    case "debug":
      return level === "debug";
    case "info":
      return level === "info" || level === "debug";
    case "warn":
      return level === "warn" || level === "info" || level === "debug";
    case "error":
      return level === "debug" || "info";
    default:
      return false;
  }
}

// src/logging/enableConsoleLogDrain.ts
var dc = (0, import_rfdc2.default)();
function createConsoleLogDrain(level) {
  return ([severity, ...other]) => {
    if (!isEnabled(level, severity)) {
      return;
    }
    const [id, ...params] = other;
    console[severity](`\u{1F94B} [${severity}] Uniform event ID ${id}
`, ...params.map(dc));
  };
}
function enableConsoleLogDrain(level) {
  const consoleLogDrain = createConsoleLogDrain(level);
  return {
    logDrain: consoleLogDrain
  };
}

// src/logging/enableDebugConsoleLogDrain.ts
var import_rfdc3 = __toESM(require("rfdc"));

// src/logging/messageContent.ts
var messageContent = {
  // CONTEXT
  1: () => ["context", "initializing Uniform Context"],
  2: (update) => ["context", "received update()", update],
  3: (scores) => ["context", "new score vector", scores],
  4: (quirks) => ["context", "updated quirks", quirks],
  5: (enrichment) => ["context", "ignored enrichment update for unknown enrichment category", enrichment.cat],
  // STORAGE
  101: (commands) => ["storage", "received update commands", commands],
  102: (data) => ["storage", "data was updated", data],
  103: (fromAllDevices) => [
    "storage",
    `deleting visitor data ${fromAllDevices ? "from all devices" : "from this device"}`
  ],
  104: (isControl) => [
    "context",
    isControl ? "Visitor assigned to personalization control group" : "Visitor assigned to personalization experiment group"
  ],
  110: ({ dim, cap, score }) => ["storage", `${dim} score ${score} exceeded cap ${cap}. Rounded down.`],
  120: () => ["storage", "visitor data expired and was cleared"],
  130: (data) => [
    "storage",
    "server to client transition score data was loaded; it will persist until the next update event occurs",
    data
  ],
  131: () => ["storage", "server to client transition data was discarded"],
  140: (decayMessage) => ["storage", `score decay was applied: ${decayMessage}`],
  // SIGNAL EVAL
  200: () => ["signals", "evaluating signals"],
  201: (signal) => ["signals", `evaluating signal ${signal.id} (${signal.dur})`],
  202: (group) => ["signals", group.op === "|" ? "OR" : "AND"],
  203: ({ criteria, result, explanation }) => [
    "signals",
    `${criteria.type}: ${explanation} is ${result.result} [${result.changed ? "CHANGED" : "unchanged"}]`
  ],
  204: (result) => [
    "signals",
    `group result: ${result.result} [${result.changed ? "CHANGED" : "unchanged"}]`
  ],
  // PERSONALIZATION
  300: (placement) => ["personalization", `executing personalization '${placement.name}'`],
  301: ({ id, op }) => ["personalization", `testing variation ${id} (${op === "|" ? "OR" : "AND"})`],
  302: ({ matched, description }) => ["personalization", `${description} is ${matched}`],
  303: (selected) => ["personalization", selected ? "selected variation" : "did not select variation"],
  // TESTING
  400: (name) => ["testing", `executing A/B test '${name}'`],
  401: (testName) => ["testing", `${testName} is not registered in the manifest; it will not be run.`],
  402: ({ missingVariant, variants }) => [
    "testing",
    `test variation '${missingVariant}' previously assigned to the visitor for this test no longer exists as a variant. It will be removed. This may indicate changing test variations after publishing a test, which will make results invalid. Known variants: ${variants.join(
      ", "
    )}`
  ],
  403: (variant) => ["testing", `assigned new test variant '${variant}'`],
  404: (variant) => ["testing", `displaying variation '${variant}'`],
  // GTAG
  700: () => [
    "gtag",
    "gtag is not defined, skipping analytics event emission. Ensure you have added the gtag script to your page."
  ],
  701: () => ["gtag", "enabled gtag event signal redirection"]
};

// src/logging/enableDebugConsoleLogDrain.ts
var dc2 = (0, import_rfdc3.default)();
function createDebugConsoleLogDrain(level, options) {
  const isServer = typeof document === "undefined";
  const { enableOnServer = false } = options != null ? options : {};
  return ([severity, ...other]) => {
    if (!isEnabled(level, severity) || isServer && !enableOnServer) {
      return;
    }
    const [id, ...params] = other;
    let consoleFunc = console[severity];
    if (params[0] === "GROUP") {
      params.shift();
      consoleFunc = console.groupCollapsed;
    }
    if (params[0] === "ENDGROUP") {
      console.groupEnd();
      return;
    }
    const messageFunc = messageContent[id];
    let icon = "";
    switch (severity) {
      case "debug":
        icon = "\u{1F41E}";
        break;
      case "info":
        icon = "\u{1F4AC}";
        break;
      case "warn":
        icon = "\u26A0\uFE0F";
        break;
      case "error":
        icon = "\u{1F4A5}";
        break;
    }
    const messagePrefix = icon;
    if (!messageFunc) {
      consoleFunc(
        `${messagePrefix} unknown event ID ${id}. Log messages data may be older than Uniform Context package.`,
        ...params
      );
      return;
    }
    const [category, messageBody, ...outParams] = messageFunc(...params);
    consoleFunc(`${messagePrefix}[${category}] ${messageBody}
`, ...outParams.map(dc2));
  };
}
function enableDebugConsoleLogDrain(level, options) {
  const debugConsoleLogDrain = createDebugConsoleLogDrain(level, options);
  return { logDrain: debugConsoleLogDrain };
}

// src/quickconnect/quickconnect.ts
function serializeQuickConnect(config) {
  return `${config.apiKey}|${config.projectId}${config.apiHost ? `|${config.apiHost}` : ""}`;
}
function parseQuickConnect(serialized) {
  const [apiKey, projectId, apiHost] = serialized.split("|");
  if (!apiKey.startsWith("uf")) {
    throw new Error("Invalid API key");
  }
  if (!/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i.test(projectId)) {
    throw new Error("Invalid project ID");
  }
  return {
    apiKey,
    projectId,
    apiHost: apiHost || "https://uniform.app"
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CONTEXTUAL_EDITING_TEST_NAME,
  CONTEXTUAL_EDITING_TEST_SELECTED_VARIANT_ID,
  Context,
  CookieTransitionDataStore,
  EdgeNodeTagName,
  EdgeTransitionDataStore,
  GroupCriteriaEvaluator,
  ManifestInstance,
  SERVER_STATE_ID,
  ScriptType,
  TransitionDataStore,
  UNIFORM_DEFAULT_COOKIE_NAME,
  VisitorDataStore,
  computeAggregateDimensions,
  cookieEvaluator,
  createConsoleLogDrain,
  createDebugConsoleLogDrain,
  createLinearDecay,
  currentPageEvaluator,
  emptyVisitorData,
  enableConsoleLogDrain,
  enableContextDevTools,
  enableDebugConsoleLogDrain,
  evaluateVariantMatch,
  eventEvaluator,
  explainStringMatch,
  explainStringMatchCriteria,
  getEnrichmentVectorKey,
  isStringMatch,
  pageViewCountDimension,
  pageViewCountEvaluator,
  parseQuickConnect,
  personalizeVariations,
  queryStringEvaluator,
  quirkEvaluator,
  serializeQuickConnect,
  testVariations
});
