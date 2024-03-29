'use client';
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Personalize: () => Personalize,
  Test: () => Test,
  Track: () => Track,
  TrackFragment: () => TrackFragment,
  UniformContext: () => UniformContext,
  useQuirks: () => useQuirks,
  useScores: () => useScores,
  useUniformContext: () => useUniformContext
});
module.exports = __toCommonJS(src_exports);

// src/hooks/useQuirks.ts
var import_react = require("react");
function useQuirks() {
  const { context } = useUniformContext();
  const [quirks, setQuirks] = (0, import_react.useState)(context.quirks);
  const quirkChangeListener = (updatedQuirks) => {
    setQuirks(updatedQuirks);
  };
  (0, import_react.useEffect)(() => {
    context.events.on("quirksUpdated", quirkChangeListener);
    return () => {
      context.events.off("quirksUpdated", quirkChangeListener);
    };
  }, [context]);
  return quirks;
}

// src/hooks/useScores.ts
var import_lite = require("dequal/lite");
var import_react2 = require("react");
function useScores() {
  const { context } = useUniformContext();
  const [scores, setScores] = (0, import_react2.useState)(context.scores);
  (0, import_react2.useEffect)(() => {
    const scoringChangeListener = (updatedScores) => {
      setScores(updatedScores);
    };
    const currentScores = context.scores;
    if (!(0, import_lite.dequal)(scores, currentScores)) {
      setScores(currentScores);
    }
    context.events.on("scoresUpdated", scoringChangeListener);
    return () => {
      context.events.off("scoresUpdated", scoringChangeListener);
    };
  }, [context]);
  return scores;
}

// src/hooks/useUniformContext.ts
var import_react4 = require("react");

// src/contexts.tsx
var import_react3 = require("react");
var UniformContextContext = (0, import_react3.createContext)(void 0);
var PersonalizationContext = (0, import_react3.createContext)({});

// src/hooks/useUniformContext.ts
function useUniformContext(options = {}) {
  const { throwOnMissingProvider = true } = options;
  const value = (0, import_react4.useContext)(UniformContextContext);
  if (throwOnMissingProvider) {
    if (value === void 0) {
      throw new Error("useUniformContext must be used within a <UniformContext> provider");
    }
    return value;
  }
  return value;
}

// src/components/Personalize.tsx
var import_react8 = __toESM(require("react"));

// src/constants.ts
var isServer = typeof window === "undefined";

// src/components/PersonalizeEdge.tsx
var import_context2 = require("@uniformdev/context");
var import_react6 = __toESM(require("react"));

// src/components/EdgeTag.tsx
var import_context = require("@uniformdev/context");
var import_react5 = require("react");
var EdgeTag = (props) => {
  return (0, import_react5.createElement)(import_context.EdgeNodeTagName, props);
};

// src/components/PersonalizeEdge.tsx
function PersonalizeEdge(props) {
  const { variations, count, component } = props;
  const options = {
    name: props.name,
    count: count != null ? count : 1
  };
  const Component = component;
  return /* @__PURE__ */ import_react6.default.createElement(import_react6.default.Fragment, null, /* @__PURE__ */ import_react6.default.createElement(
    EdgeTag,
    {
      "data-type": import_context2.ScriptType.ListStart,
      dangerouslySetInnerHTML: { __html: JSON.stringify(options) }
    }
  ), variations.map((variant) => /* @__PURE__ */ import_react6.default.createElement(import_react6.Fragment, { key: variant.id }, /* @__PURE__ */ import_react6.default.createElement(
    EdgeTag,
    {
      "data-type": import_context2.ScriptType.ListItemSettings,
      dangerouslySetInnerHTML: {
        __html: JSON.stringify({
          id: variant.id,
          pz: variant.pz || null
        })
      }
    }
  ), /* @__PURE__ */ import_react6.default.createElement(EdgeTag, { "data-type": import_context2.ScriptType.ListItem }, /* @__PURE__ */ import_react6.default.createElement(
    Component,
    {
      key: variant.id,
      personalizationResult: { variation: variant, personalizationOccurred: false },
      ...variant
    }
  )))), /* @__PURE__ */ import_react6.default.createElement(EdgeTag, { "data-type": import_context2.ScriptType.ListEnd }));
}

// src/components/PersonalizeStandard.tsx
var import_react7 = __toESM(require("react"));
function PersonalizeStandard({
  variations,
  component,
  wrapperComponent,
  name,
  count = 1
}) {
  const { context } = useUniformContext();
  const scores = useScores();
  const { variations: personalizedVariations, personalized: personalizationOccurred } = (0, import_react7.useMemo)(
    () => context.personalize({
      name,
      variations,
      take: count
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scores, context, count, name, variations]
  );
  const Wrapper = wrapperComponent != null ? wrapperComponent : ({ children }) => /* @__PURE__ */ import_react7.default.createElement(import_react7.default.Fragment, null, children);
  const Component = component;
  return /* @__PURE__ */ import_react7.default.createElement(PersonalizationContext.Provider, { value: { personalized: true } }, personalizedVariations.length ? /* @__PURE__ */ import_react7.default.createElement(Wrapper, { personalizationOccurred }, personalizedVariations.map((variant) => /* @__PURE__ */ import_react7.default.createElement(
    Component,
    {
      key: variant.id,
      personalizationResult: { variation: variant, personalizationOccurred },
      ...variant
    }
  ))) : null);
}

// src/components/Personalize.tsx
function Personalize(props) {
  var _a;
  const { outputType } = (_a = useUniformContext({ throwOnMissingProvider: false })) != null ? _a : {};
  if (!outputType) {
    throw new Error(
      "Using the <Personalize /> component requires the <UniformContext> provider to be present."
    );
  }
  if (!isServer || outputType === "standard") {
    return /* @__PURE__ */ import_react8.default.createElement(PersonalizeStandard, { ...props });
  } else if (outputType === "edge") {
    return /* @__PURE__ */ import_react8.default.createElement(PersonalizeEdge, { ...props });
  }
  return null;
}

// src/components/Test.tsx
var import_react11 = __toESM(require("react"));

// src/components/TestEdge.tsx
var import_context3 = require("@uniformdev/context");
var import_react9 = __toESM(require("react"));
function TestEdge(props) {
  const { name, variations, component } = props;
  const options = {
    name
  };
  const Component = component;
  return /* @__PURE__ */ import_react9.default.createElement(import_react9.default.Fragment, null, /* @__PURE__ */ import_react9.default.createElement(
    EdgeTag,
    {
      "data-type": import_context3.ScriptType.TestStart,
      dangerouslySetInnerHTML: { __html: JSON.stringify(options) }
    }
  ), variations.map((variation, index) => {
    return /* @__PURE__ */ import_react9.default.createElement(import_react9.Fragment, { key: variation.id }, /* @__PURE__ */ import_react9.default.createElement(
      EdgeTag,
      {
        "data-type": import_context3.ScriptType.ListItemSettings,
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            id: variation.id
          })
        }
      }
    ), /* @__PURE__ */ import_react9.default.createElement(EdgeTag, { "data-type": import_context3.ScriptType.ListItem }, /* @__PURE__ */ import_react9.default.createElement(Component, { key: index, ...variation })));
  }), /* @__PURE__ */ import_react9.default.createElement(EdgeTag, { "data-type": import_context3.ScriptType.TestEnd }));
}

// src/components/TestStandard.tsx
var import_react10 = __toESM(require("react"));
var TestStandard = ({
  name,
  variations,
  component
}) => {
  const { context } = useUniformContext();
  const { result } = context.test({
    name,
    variations
  });
  if (!result) {
    return null;
  }
  const Component = component;
  return /* @__PURE__ */ import_react10.default.createElement(Component, { ...result });
};

// src/components/Test.tsx
var Test = (props) => {
  var _a;
  const { outputType } = (_a = useUniformContext({ throwOnMissingProvider: false })) != null ? _a : {};
  if (!outputType) {
    throw new Error("Using the <Test /> component requires the <UniformContext> provider to be present.");
  }
  if (!isServer || outputType === "standard") {
    return /* @__PURE__ */ import_react11.default.createElement(TestStandard, { ...props });
  } else if (outputType === "edge") {
    return /* @__PURE__ */ import_react11.default.createElement(TestEdge, { ...props });
  }
  return null;
};

// src/components/Track.tsx
var import_react13 = require("react");

// src/hooks/useIsPersonalized.ts
var import_react12 = require("react");
var useIsPersonalized = (options) => {
  const { personalized } = (0, import_react12.useContext)(PersonalizationContext);
  if (typeof personalized !== "undefined") {
    return personalized;
  }
  if (typeof (options == null ? void 0 : options.personalized) !== "undefined") {
    return options.personalized;
  }
  return false;
};

// src/components/Track.tsx
var Track = ({
  behavior,
  children,
  tagName = "div",
  threshold = 0.5,
  disableVisibilityTrigger = typeof window === "undefined" || !("IntersectionObserver" in window),
  ...rest
}) => {
  const currentUrl = typeof document === "undefined" ? "__uniform_ssr_url" : document.location.href;
  const { context } = useUniformContext();
  const insidePersonalizeComponent = useIsPersonalized();
  const [lastUrl, setLastUrl] = (0, import_react13.useState)();
  const [hasTracked, setHasTracked] = (0, import_react13.useState)(false);
  const wrapperEl = (0, import_react13.useRef)(null);
  const disconnect = (0, import_react13.useRef)();
  (0, import_react13.useEffect)(() => {
    const urlHasChanged = lastUrl !== currentUrl;
    if (urlHasChanged) {
      setHasTracked(false);
      setLastUrl(currentUrl);
    }
  }, [currentUrl, lastUrl]);
  (0, import_react13.useEffect)(() => {
    var _a;
    const hasNoBehaviorValue = !behavior || Array.isArray(behavior) && !behavior.length;
    const cannotTrack = insidePersonalizeComponent || hasNoBehaviorValue;
    if (cannotTrack || !wrapperEl.current)
      return;
    const enrichments = Array.isArray(behavior) ? behavior : [behavior];
    const pushBehaviorEnrichment = () => {
      var _a2;
      if (hasTracked) {
        return;
      }
      context.update({
        enrichments
      });
      setHasTracked(true);
      (_a2 = disconnect.current) == null ? void 0 : _a2.call(disconnect);
    };
    if (disableVisibilityTrigger) {
      pushBehaviorEnrichment();
    } else {
      (_a = disconnect.current) == null ? void 0 : _a.call(disconnect);
      const instance = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            pushBehaviorEnrichment();
          }
        },
        {
          threshold
        }
      );
      instance.observe(wrapperEl.current);
      disconnect.current = () => {
        var _a2;
        return (_a2 = instance.disconnect) == null ? void 0 : _a2.call(instance);
      };
    }
    return () => {
      var _a2;
      (_a2 = disconnect.current) == null ? void 0 : _a2.call(disconnect);
    };
  }, [
    context,
    behavior,
    disableVisibilityTrigger,
    threshold,
    insidePersonalizeComponent,
    lastUrl,
    currentUrl,
    hasTracked
  ]);
  const debugProps = {};
  if (process.env.NODE_ENV === "development") {
    debugProps["data-track-on-view-wrapper"] = "This div wrapper is added by Uniform Context, check 'behaviorTracking' property of UniformComposition";
  }
  const element = (0, import_react13.createElement)(tagName, { ...debugProps, ...rest, ref: wrapperEl }, children);
  return element;
};

// src/components/TrackFragment.tsx
var import_react14 = __toESM(require("react"));
var import_react15 = require("react");
var TrackFragment = ({ behavior, children }) => {
  const currentUrl = typeof document === "undefined" ? "__uniform_ssr_url" : document.location.href;
  const { context } = useUniformContext();
  const insidePersonalizeComponent = useIsPersonalized();
  const [lastUrl, setLastUrl] = (0, import_react15.useState)();
  const [hasTracked, setHasTracked] = (0, import_react15.useState)(false);
  (0, import_react15.useEffect)(() => {
    const urlHasChanged = lastUrl !== currentUrl;
    if (urlHasChanged) {
      setHasTracked(false);
      setLastUrl(currentUrl);
    }
  }, [currentUrl, lastUrl]);
  (0, import_react15.useEffect)(() => {
    const hasNoBehaviorValue = !behavior || Array.isArray(behavior) && !behavior.length;
    const cannotTrack = insidePersonalizeComponent || hasNoBehaviorValue;
    if (cannotTrack)
      return;
    const pushBehaviorEnrichment = () => {
      if (hasTracked) {
        return;
      }
      const enrichments = Array.isArray(behavior) ? behavior : [behavior];
      context.update({
        enrichments
      });
      setHasTracked(true);
    };
    pushBehaviorEnrichment();
  }, [context, behavior, insidePersonalizeComponent, hasTracked]);
  return /* @__PURE__ */ import_react14.default.createElement(import_react14.default.Fragment, null, children);
};

// src/components/UniformContext.tsx
var import_context4 = require("@uniformdev/context");
var import_cookie = __toESM(require("cookie"));
var import_react16 = __toESM(require("react"));
var UniformContext = ({
  context,
  children,
  outputType = "standard",
  trackRouteOnRender = true,
  includeTransferState = "server-only"
}) => {
  (0, import_react16.useEffect)(() => {
    if (isServer || !trackRouteOnRender) {
      return;
    }
    context.update({
      url: new URL(window.location.href),
      cookies: import_cookie.default.parse(document.cookie)
    });
  });
  const showTransferState = includeTransferState === "always" || includeTransferState === "server-only" && isServer;
  return /* @__PURE__ */ import_react16.default.createElement(UniformContextContext.Provider, { value: { context, outputType } }, children, showTransferState ? /* @__PURE__ */ import_react16.default.createElement(TransferState, null) : null);
};
function TransferState() {
  const { context } = useUniformContext();
  const transferState = context.getServerToClientTransitionState();
  return /* @__PURE__ */ import_react16.default.createElement(
    "script",
    {
      id: import_context4.SERVER_STATE_ID,
      type: "application/json",
      dangerouslySetInnerHTML: {
        __html: JSON.stringify(transferState)
      }
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Personalize,
  Test,
  Track,
  TrackFragment,
  UniformContext,
  useQuirks,
  useScores,
  useUniformContext
});
