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

// src/api/api.ts
var api_exports = {};
__export(api_exports, {
  AggregateClient: () => AggregateClient,
  ApiClient: () => ApiClient,
  ApiClientError: () => ApiClientError,
  CachedAggregateClient: () => CachedAggregateClient,
  CachedContextClient: () => CachedContextClient,
  CachedDimensionClient: () => CachedDimensionClient,
  CachedEnrichmentClient: () => CachedEnrichmentClient,
  CachedManifestClient: () => CachedManifestClient,
  CachedQuirkClient: () => CachedQuirkClient,
  CachedSignalClient: () => CachedSignalClient,
  CachedTestClient: () => CachedTestClient,
  ContextClient: () => ContextClient,
  DimensionClient: () => DimensionClient,
  EnrichmentClient: () => EnrichmentClient,
  ManifestClient: () => ManifestClient,
  QuirkClient: () => QuirkClient,
  SignalClient: () => SignalClient,
  TestClient: () => TestClient,
  UncachedAggregateClient: () => UncachedAggregateClient,
  UncachedContextClient: () => UncachedContextClient,
  UncachedDimensionClient: () => UncachedDimensionClient,
  UncachedEnrichmentClient: () => UncachedEnrichmentClient,
  UncachedManifestClient: () => UncachedManifestClient,
  UncachedQuirkClient: () => UncachedQuirkClient,
  UncachedSignalClient: () => UncachedSignalClient,
  UncachedTestClient: () => UncachedTestClient,
  computeDimensionDefinitionDisplayData: () => computeDimensionDefinitionDisplayData,
  computeDimensionDisplayData: () => computeDimensionDisplayData,
  computeDimensionDisplayName: () => computeDimensionDisplayName,
  defaultLimitPolicy: () => defaultLimitPolicy,
  handleRateLimits: () => handleRateLimits,
  nullLimitPolicy: () => nullLimitPolicy
});
module.exports = __toCommonJS(api_exports);

// src/api/apiClientUtils.ts
var import_p_limit = __toESM(require("p-limit"));
var nullLimitPolicy = async (func) => await func();
var defaultLimitPolicy = (0, import_p_limit.default)(6);
var ApiClientError = class _ApiClientError extends Error {
  constructor(errorMessage, fetchMethod, fetchUri, statusCode, statusText, requestId) {
    super(
      `${errorMessage}
 ${statusCode}${statusText ? " " + statusText : ""} (${fetchMethod} ${fetchUri}${requestId ? ` Request ID: ${requestId}` : ""})`
    );
    this.errorMessage = errorMessage;
    this.fetchMethod = fetchMethod;
    this.fetchUri = fetchUri;
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.requestId = requestId;
    Object.setPrototypeOf(this, _ApiClientError.prototype);
  }
};

// src/api/ApiClient.ts
var ApiClient = class _ApiClient {
  constructor(options) {
    __publicField(this, "options");
    var _a, _b, _c, _d, _e;
    if (!options.apiKey && !options.bearerToken) {
      throw new Error("You must provide an API key or a bearer token");
    }
    let leFetch = options.fetch;
    if (!leFetch) {
      if (typeof window !== "undefined") {
        leFetch = window.fetch.bind(window);
      } else if (typeof fetch !== "undefined") {
        leFetch = fetch;
      } else {
        throw new Error("You must provide or polyfill a fetch implementation when not in a browser");
      }
    }
    this.options = {
      ...options,
      fetch: leFetch,
      apiHost: this.ensureApiHost(options.apiHost),
      apiKey: (_a = options.apiKey) != null ? _a : null,
      projectId: (_b = options.projectId) != null ? _b : null,
      bearerToken: (_c = options.bearerToken) != null ? _c : null,
      limitPolicy: (_d = options.limitPolicy) != null ? _d : defaultLimitPolicy,
      bypassCache: (_e = options.bypassCache) != null ? _e : false
    };
  }
  async apiClient(fetchUri, options) {
    return this.options.limitPolicy(async () => {
      var _a;
      const coreHeaders = this.options.apiKey ? {
        "x-api-key": this.options.apiKey
      } : {
        Authorization: `Bearer ${this.options.bearerToken}`
      };
      if (this.options.bypassCache) {
        coreHeaders["x-bypass-cache"] = "true";
      }
      const { fetch: fetch2 } = this.options;
      const callApi = () => fetch2(fetchUri.toString(), {
        ...options,
        headers: {
          ...options == null ? void 0 : options.headers,
          ...coreHeaders
        }
      });
      const apiResponse = await handleRateLimits(callApi);
      if (!apiResponse.ok) {
        let message = "";
        try {
          const responseText = await apiResponse.text();
          try {
            const parsed = JSON.parse(responseText);
            if (parsed.errorMessage) {
              message = Array.isArray(parsed.errorMessage) ? parsed.errorMessage.join(", ") : parsed.errorMessage;
            } else {
              message = responseText;
            }
          } catch (e) {
            message = responseText;
          }
        } catch (e) {
          message = `General error`;
        }
        throw new ApiClientError(
          message,
          (_a = options == null ? void 0 : options.method) != null ? _a : "GET",
          fetchUri.toString(),
          apiResponse.status,
          apiResponse.statusText,
          _ApiClient.getRequestId(apiResponse)
        );
      }
      if (options == null ? void 0 : options.expectNoContent) {
        return null;
      }
      return await apiResponse.json();
    });
  }
  createUrl(path, queryParams, hostOverride) {
    const url = new URL(`${hostOverride != null ? hostOverride : this.options.apiHost}${path}`);
    Object.entries(queryParams != null ? queryParams : {}).forEach(([key, value]) => {
      var _a;
      if (typeof value !== "undefined" && value !== null) {
        url.searchParams.append(key, Array.isArray(value) ? value.join(",") : (_a = value == null ? void 0 : value.toString()) != null ? _a : "");
      }
    });
    return url;
  }
  ensureApiHost(apiHost) {
    if (!apiHost)
      return "https://uniform.app";
    if (!(apiHost == null ? void 0 : apiHost.startsWith("http"))) {
      throw new Error('Your apiHost must start with "http"');
    }
    if (apiHost.indexOf("/", 8) > -1) {
      throw new Error("Your apiHost must not contain a path element after the domain");
    }
    if (apiHost.indexOf("?") > -1) {
      throw new Error("Your apiHost must not contain a query string");
    }
    if (apiHost == null ? void 0 : apiHost.endsWith("/")) {
      apiHost = apiHost.substring(0, apiHost.length - 1);
    }
    return apiHost;
  }
  static getRequestId(response) {
    const apigRequestId = response.headers.get("apigw-requestid");
    if (apigRequestId) {
      return apigRequestId;
    }
    return void 0;
  }
};
async function handleRateLimits(callApi) {
  var _a;
  const backoffRetries = 5;
  let backoffRetriesLeft = backoffRetries;
  let response;
  while (backoffRetriesLeft > 0) {
    response = await callApi();
    if (response.status !== 429) {
      break;
    }
    let resetWait = 0;
    try {
      const responseClone = response.clone();
      const dateHeader = responseClone.headers.get("date");
      const serverTime = dateHeader ? new Date(dateHeader).getTime() : void 0;
      const body = await responseClone.json();
      const resetTime = (_a = body == null ? void 0 : body.info) == null ? void 0 : _a.reset;
      if (typeof serverTime === "number" && typeof resetTime === "number") {
        resetWait = Math.max(0, Math.min(Math.round(1.1 * (resetTime - serverTime)), 1e4));
      }
    } catch (err) {
    }
    const base = Math.pow(2, backoffRetries - backoffRetriesLeft) * 333;
    const backoffWait = base + Math.round(Math.random() * (base / 2)) * (Math.random() > 0.5 ? 1 : -1);
    await new Promise((resolve) => setTimeout(resolve, resetWait + backoffWait));
    backoffRetriesLeft -= 1;
  }
  return response;
}

// src/api/AggregateClient.ts
var _url;
var _AggregateClient = class _AggregateClient extends ApiClient {
  constructor(options) {
    super(options);
  }
  /** Fetches all aggregates for a project */
  async get(options) {
    const { projectId } = this.options;
    const fetchUri = this.createUrl(__privateGet(_AggregateClient, _url), { ...options, projectId });
    return await this.apiClient(fetchUri);
  }
  /** Updates or creates (based on id) an Aggregate */
  async upsert(body) {
    const fetchUri = this.createUrl(__privateGet(_AggregateClient, _url));
    await this.apiClient(fetchUri, {
      method: "PUT",
      body: JSON.stringify({ ...body, projectId: this.options.projectId }),
      expectNoContent: true
    });
  }
  /** Deletes an Aggregate */
  async remove(body) {
    const fetchUri = this.createUrl(__privateGet(_AggregateClient, _url));
    await this.apiClient(fetchUri, {
      method: "DELETE",
      body: JSON.stringify({ ...body, projectId: this.options.projectId }),
      expectNoContent: true
    });
  }
};
_url = new WeakMap();
__privateAdd(_AggregateClient, _url, "/api/v2/aggregate");
var AggregateClient = _AggregateClient;
var UncachedAggregateClient = class extends AggregateClient {
  constructor(options) {
    super({ ...options, bypassCache: true });
  }
};
var CachedAggregateClient = class extends AggregateClient {
  constructor(options) {
    super({ ...options, bypassCache: false });
  }
};

// src/manifest/constants.ts
var ENR_SEPARATOR = "_";

// src/api/computeDimensionDisplayName.ts
function computeDimensionDefinitionDisplayData(dim) {
  const type = dim.category === "ENR" ? "Enrichment" : dim.category === "SIG" ? "Signal" : dim.subcategory === "1" ? "Intent" : dim.subcategory === "0" ? "Audience" : "Aggregate";
  return {
    dim: dim.dim,
    name: dim.name,
    type,
    category: dim.category === "ENR" ? dim.subcategory : void 0
  };
}
function computeDimensionDisplayData(dim, manifest) {
  var _a, _b, _c, _d;
  if ((_b = (_a = manifest.project.pz) == null ? void 0 : _a.agg) == null ? void 0 : _b[dim]) {
    return { dim, name: dim, type: "Aggregate" };
  } else if ((_d = (_c = manifest.project.pz) == null ? void 0 : _c.sig) == null ? void 0 : _d[dim]) {
    return { dim, name: dim, type: "Signal" };
  } else if (dim.indexOf(ENR_SEPARATOR) >= 0) {
    const [cat, value] = dim.split(ENR_SEPARATOR);
    return {
      dim,
      name: value,
      type: "Enrichment",
      category: cat
    };
  }
  return void 0;
}
function computeDimensionDisplayName(dim) {
  const { type, name } = computeDimensionDefinitionDisplayData(dim);
  return `${type}: ${name}`;
}

// src/api/DimensionClient.ts
var _url2;
var _DimensionClient = class _DimensionClient extends ApiClient {
  constructor(options) {
    super(options);
  }
  /** Fetches the known score dimensions for a project */
  async get(options) {
    const { projectId } = this.options;
    const fetchUri = this.createUrl(__privateGet(_DimensionClient, _url2), { ...options, projectId });
    return await this.apiClient(fetchUri);
  }
};
_url2 = new WeakMap();
__privateAdd(_DimensionClient, _url2, "/api/v2/dimension");
var DimensionClient = _DimensionClient;
var UncachedDimensionClient = class extends DimensionClient {
  constructor(options) {
    super({ ...options, bypassCache: true });
  }
};
var CachedDimensionClient = class extends DimensionClient {
  constructor(options) {
    super({ ...options, bypassCache: false });
  }
};

// src/api/EnrichmentClient.ts
var _url3, _valueUrl;
var _EnrichmentClient = class _EnrichmentClient extends ApiClient {
  constructor(options) {
    super(options);
  }
  /** Fetches all enrichments and values for a project, grouped by category */
  async get(options) {
    const { projectId } = this.options;
    const fetchUri = this.createUrl(__privateGet(_EnrichmentClient, _url3), { ...options, projectId });
    return await this.apiClient(fetchUri);
  }
  /** Updates or creates (based on id) an enrichment category */
  async upsertCategory(body) {
    const fetchUri = this.createUrl(__privateGet(_EnrichmentClient, _url3));
    await this.apiClient(fetchUri, {
      method: "PUT",
      body: JSON.stringify({ ...body, projectId: this.options.projectId }),
      expectNoContent: true
    });
  }
  /** Deletes an enrichment category */
  async removeCategory(body) {
    const fetchUri = this.createUrl(__privateGet(_EnrichmentClient, _url3));
    await this.apiClient(fetchUri, {
      method: "DELETE",
      body: JSON.stringify({ ...body, projectId: this.options.projectId }),
      expectNoContent: true
    });
  }
  /** Updates or creates (based on id) an enrichment value within an enrichment category */
  async upsertValue(body) {
    const fetchUri = this.createUrl(__privateGet(_EnrichmentClient, _valueUrl));
    await this.apiClient(fetchUri, {
      method: "PUT",
      body: JSON.stringify({ ...body, projectId: this.options.projectId }),
      expectNoContent: true
    });
  }
  /** Deletes an enrichment value within an enrichment category. The category is left alone. */
  async removeValue(body) {
    const fetchUri = this.createUrl(__privateGet(_EnrichmentClient, _valueUrl));
    await this.apiClient(fetchUri, {
      method: "DELETE",
      body: JSON.stringify({ ...body, projectId: this.options.projectId }),
      expectNoContent: true
    });
  }
};
_url3 = new WeakMap();
_valueUrl = new WeakMap();
__privateAdd(_EnrichmentClient, _url3, "/api/v1/enrichments");
__privateAdd(_EnrichmentClient, _valueUrl, "/api/v1/enrichment-values");
var EnrichmentClient = _EnrichmentClient;
var UncachedEnrichmentClient = class extends EnrichmentClient {
  constructor(options) {
    super({ ...options, bypassCache: true });
  }
};
var CachedEnrichmentClient = class extends EnrichmentClient {
  constructor(options) {
    super({ ...options, bypassCache: false });
  }
};

// src/api/ManifestClient.ts
var _url4;
var _ManifestClient = class _ManifestClient extends ApiClient {
  constructor(options) {
    super(options);
  }
  /** Fetches the Context manifest for a project */
  async get(options) {
    const { projectId } = this.options;
    const fetchUri = this.createUrl(__privateGet(_ManifestClient, _url4), { ...options, projectId });
    return await this.apiClient(fetchUri);
  }
  /** Publishes the Context manifest for a project */
  async publish() {
    const { projectId } = this.options;
    const fetchUri = this.createUrl("/api/v1/publish", { siteId: projectId });
    await this.apiClient(fetchUri, {
      method: "POST",
      expectNoContent: true
    });
  }
};
_url4 = new WeakMap();
__privateAdd(_ManifestClient, _url4, "/api/v2/manifest");
var ManifestClient = _ManifestClient;
var UncachedManifestClient = class extends ManifestClient {
  constructor(options) {
    super({ ...options, bypassCache: true });
  }
};
var CachedManifestClient = class extends ManifestClient {
  constructor(options) {
    super({ ...options, bypassCache: false });
  }
};

// src/api/QuirkClient.ts
var _url5;
var _QuirkClient = class _QuirkClient extends ApiClient {
  constructor(options) {
    super(options);
  }
  /** Fetches all Quirks for a project */
  async get(options) {
    const { projectId } = this.options;
    const fetchUri = this.createUrl(__privateGet(_QuirkClient, _url5), { ...options, projectId });
    return await this.apiClient(fetchUri);
  }
  /** Updates or creates (based on id) a Quirk */
  async upsert(body) {
    const fetchUri = this.createUrl(__privateGet(_QuirkClient, _url5));
    await this.apiClient(fetchUri, {
      method: "PUT",
      body: JSON.stringify({ ...body, projectId: this.options.projectId }),
      expectNoContent: true
    });
  }
  /** Deletes a Quirk */
  async remove(body) {
    const fetchUri = this.createUrl(__privateGet(_QuirkClient, _url5));
    await this.apiClient(fetchUri, {
      method: "DELETE",
      body: JSON.stringify({ ...body, projectId: this.options.projectId }),
      expectNoContent: true
    });
  }
};
_url5 = new WeakMap();
__privateAdd(_QuirkClient, _url5, "/api/v2/quirk");
var QuirkClient = _QuirkClient;
var UncachedQuirkClient = class extends QuirkClient {
  constructor(options) {
    super({ ...options, bypassCache: true });
  }
};
var CachedQuirkClient = class extends QuirkClient {
  constructor(options) {
    super({ ...options, bypassCache: false });
  }
};

// src/api/SignalClient.ts
var _url6;
var _SignalClient = class _SignalClient extends ApiClient {
  constructor(options) {
    super(options);
  }
  /** Fetches all Signals for a project */
  async get(options) {
    const { projectId } = this.options;
    const fetchUri = this.createUrl(__privateGet(_SignalClient, _url6), { ...options, projectId });
    return await this.apiClient(fetchUri);
  }
  /** Updates or creates (based on id) a Signal */
  async upsert(body) {
    const fetchUri = this.createUrl(__privateGet(_SignalClient, _url6));
    await this.apiClient(fetchUri, {
      method: "PUT",
      body: JSON.stringify({ ...body, projectId: this.options.projectId }),
      expectNoContent: true
    });
  }
  /** Deletes a Signal */
  async remove(body) {
    const fetchUri = this.createUrl(__privateGet(_SignalClient, _url6));
    await this.apiClient(fetchUri, {
      method: "DELETE",
      body: JSON.stringify({ ...body, projectId: this.options.projectId }),
      expectNoContent: true
    });
  }
};
_url6 = new WeakMap();
__privateAdd(_SignalClient, _url6, "/api/v2/signal");
var SignalClient = _SignalClient;
var UncachedSignalClient = class extends SignalClient {
  constructor(options) {
    super({ ...options, bypassCache: true });
  }
};
var CachedSignalClient = class extends SignalClient {
  constructor(options) {
    super({ ...options, bypassCache: false });
  }
};

// src/api/TestClient.ts
var _url7;
var _TestClient = class _TestClient extends ApiClient {
  constructor(options) {
    super(options);
  }
  /** Fetches all Tests for a project */
  async get(options) {
    const { projectId } = this.options;
    const fetchUri = this.createUrl(__privateGet(_TestClient, _url7), { ...options, projectId });
    return await this.apiClient(fetchUri);
  }
  /** Updates or creates (based on id) a Test */
  async upsert(body) {
    const fetchUri = this.createUrl(__privateGet(_TestClient, _url7));
    await this.apiClient(fetchUri, {
      method: "PUT",
      body: JSON.stringify({ ...body, projectId: this.options.projectId }),
      expectNoContent: true
    });
  }
  /** Deletes a Test */
  async remove(body) {
    const fetchUri = this.createUrl(__privateGet(_TestClient, _url7));
    await this.apiClient(fetchUri, {
      method: "DELETE",
      body: JSON.stringify({ ...body, projectId: this.options.projectId }),
      expectNoContent: true
    });
  }
};
_url7 = new WeakMap();
__privateAdd(_TestClient, _url7, "/api/v2/test");
var TestClient = _TestClient;
var UncachedTestClient = class extends TestClient {
  constructor(options) {
    super({ ...options, bypassCache: true });
  }
};
var CachedTestClient = class extends TestClient {
  constructor(options) {
    super({ ...options, bypassCache: false });
  }
};

// src/api/ContextClient.ts
var ContextClient = class {
  constructor(options) {
    __publicField(this, "enrichments");
    __publicField(this, "aggregates");
    __publicField(this, "dimensions");
    __publicField(this, "manifest");
    __publicField(this, "quirks");
    __publicField(this, "signals");
    __publicField(this, "tests");
    this.enrichments = new EnrichmentClient(options);
    this.aggregates = new AggregateClient(options);
    this.dimensions = new DimensionClient(options);
    this.manifest = new ManifestClient(options);
    this.quirks = new QuirkClient(options);
    this.signals = new SignalClient(options);
    this.tests = new TestClient(options);
  }
};
var UncachedContextClient = class extends ContextClient {
  constructor(options) {
    super({ ...options, bypassCache: true });
  }
};
var CachedContextClient = class extends ContextClient {
  constructor(options) {
    super({ ...options, bypassCache: false });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AggregateClient,
  ApiClient,
  ApiClientError,
  CachedAggregateClient,
  CachedContextClient,
  CachedDimensionClient,
  CachedEnrichmentClient,
  CachedManifestClient,
  CachedQuirkClient,
  CachedSignalClient,
  CachedTestClient,
  ContextClient,
  DimensionClient,
  EnrichmentClient,
  ManifestClient,
  QuirkClient,
  SignalClient,
  TestClient,
  UncachedAggregateClient,
  UncachedContextClient,
  UncachedDimensionClient,
  UncachedEnrichmentClient,
  UncachedManifestClient,
  UncachedQuirkClient,
  UncachedSignalClient,
  UncachedTestClient,
  computeDimensionDefinitionDisplayData,
  computeDimensionDisplayData,
  computeDimensionDisplayName,
  defaultLimitPolicy,
  handleRateLimits,
  nullLimitPolicy
});
