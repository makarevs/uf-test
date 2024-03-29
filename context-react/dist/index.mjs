'use client';

// src/hooks/useQuirks.ts
import { useEffect, useState } from "react";
function useQuirks() {
  const { context } = useUniformContext();
  const [quirks, setQuirks] = useState(context.quirks);
  const quirkChangeListener = (updatedQuirks) => {
    setQuirks(updatedQuirks);
  };
  useEffect(() => {
    context.events.on("quirksUpdated", quirkChangeListener);
    return () => {
      context.events.off("quirksUpdated", quirkChangeListener);
    };
  }, [context]);
  return quirks;
}

// src/hooks/useScores.ts
import { dequal } from "dequal/lite";
import { useEffect as useEffect2, useState as useState2 } from "react";
function useScores() {
  const { context } = useUniformContext();
  const [scores, setScores] = useState2(context.scores);
  useEffect2(() => {
    const scoringChangeListener = (updatedScores) => {
      setScores(updatedScores);
    };
    const currentScores = context.scores;
    if (!dequal(scores, currentScores)) {
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
import { useContext } from "react";

// src/contexts.tsx
import { createContext } from "react";
var UniformContextContext = createContext(void 0);
var PersonalizationContext = createContext({});

// src/hooks/useUniformContext.ts
function useUniformContext(options = {}) {
  const { throwOnMissingProvider = true } = options;
  const value = useContext(UniformContextContext);
  if (throwOnMissingProvider) {
    if (value === void 0) {
      throw new Error("useUniformContext must be used within a <UniformContext> provider");
    }
    return value;
  }
  return value;
}

// src/components/Personalize.tsx
import React3 from "react";

// src/constants.ts
var isServer = typeof window === "undefined";

// src/components/PersonalizeEdge.tsx
import { ScriptType } from "@uniformdev/context";
import React, { Fragment } from "react";

// src/components/EdgeTag.tsx
import { EdgeNodeTagName } from "@uniformdev/context";
import { createElement } from "react";
var EdgeTag = (props) => {
  return createElement(EdgeNodeTagName, props);
};

// src/components/PersonalizeEdge.tsx
function PersonalizeEdge(props) {
  const { variations, count, component } = props;
  const options = {
    name: props.name,
    count: count != null ? count : 1
  };
  const Component = component;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    EdgeTag,
    {
      "data-type": ScriptType.ListStart,
      dangerouslySetInnerHTML: { __html: JSON.stringify(options) }
    }
  ), variations.map((variant) => /* @__PURE__ */ React.createElement(Fragment, { key: variant.id }, /* @__PURE__ */ React.createElement(
    EdgeTag,
    {
      "data-type": ScriptType.ListItemSettings,
      dangerouslySetInnerHTML: {
        __html: JSON.stringify({
          id: variant.id,
          pz: variant.pz || null
        })
      }
    }
  ), /* @__PURE__ */ React.createElement(EdgeTag, { "data-type": ScriptType.ListItem }, /* @__PURE__ */ React.createElement(
    Component,
    {
      key: variant.id,
      personalizationResult: { variation: variant, personalizationOccurred: false },
      ...variant
    }
  )))), /* @__PURE__ */ React.createElement(EdgeTag, { "data-type": ScriptType.ListEnd }));
}

// src/components/PersonalizeStandard.tsx
import React2, { useMemo } from "react";
function PersonalizeStandard({
  variations,
  component,
  wrapperComponent,
  name,
  count = 1
}) {
  const { context } = useUniformContext();
  const scores = useScores();
  const { variations: personalizedVariations, personalized: personalizationOccurred } = useMemo(
    () => context.personalize({
      name,
      variations,
      take: count
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scores, context, count, name, variations]
  );
  const Wrapper = wrapperComponent != null ? wrapperComponent : ({ children }) => /* @__PURE__ */ React2.createElement(React2.Fragment, null, children);
  const Component = component;
  return /* @__PURE__ */ React2.createElement(PersonalizationContext.Provider, { value: { personalized: true } }, personalizedVariations.length ? /* @__PURE__ */ React2.createElement(Wrapper, { personalizationOccurred }, personalizedVariations.map((variant) => /* @__PURE__ */ React2.createElement(
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
    return /* @__PURE__ */ React3.createElement(PersonalizeStandard, { ...props });
  } else if (outputType === "edge") {
    return /* @__PURE__ */ React3.createElement(PersonalizeEdge, { ...props });
  }
  return null;
}

// src/components/Test.tsx
import React6 from "react";

// src/components/TestEdge.tsx
import { ScriptType as ScriptType2 } from "@uniformdev/context";
import React4, { Fragment as Fragment2 } from "react";
function TestEdge(props) {
  const { name, variations, component } = props;
  const options = {
    name
  };
  const Component = component;
  return /* @__PURE__ */ React4.createElement(React4.Fragment, null, /* @__PURE__ */ React4.createElement(
    EdgeTag,
    {
      "data-type": ScriptType2.TestStart,
      dangerouslySetInnerHTML: { __html: JSON.stringify(options) }
    }
  ), variations.map((variation, index) => {
    return /* @__PURE__ */ React4.createElement(Fragment2, { key: variation.id }, /* @__PURE__ */ React4.createElement(
      EdgeTag,
      {
        "data-type": ScriptType2.ListItemSettings,
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            id: variation.id
          })
        }
      }
    ), /* @__PURE__ */ React4.createElement(EdgeTag, { "data-type": ScriptType2.ListItem }, /* @__PURE__ */ React4.createElement(Component, { key: index, ...variation })));
  }), /* @__PURE__ */ React4.createElement(EdgeTag, { "data-type": ScriptType2.TestEnd }));
}

// src/components/TestStandard.tsx
import React5 from "react";
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
  return /* @__PURE__ */ React5.createElement(Component, { ...result });
};

// src/components/Test.tsx
var Test = (props) => {
  var _a;
  const { outputType } = (_a = useUniformContext({ throwOnMissingProvider: false })) != null ? _a : {};
  if (!outputType) {
    throw new Error("Using the <Test /> component requires the <UniformContext> provider to be present.");
  }
  if (!isServer || outputType === "standard") {
    return /* @__PURE__ */ React6.createElement(TestStandard, { ...props });
  } else if (outputType === "edge") {
    return /* @__PURE__ */ React6.createElement(TestEdge, { ...props });
  }
  return null;
};

// src/components/Track.tsx
import { createElement as createElement2, useEffect as useEffect3, useRef, useState as useState3 } from "react";

// src/hooks/useIsPersonalized.ts
import { useContext as useContext2 } from "react";
var useIsPersonalized = (options) => {
  const { personalized } = useContext2(PersonalizationContext);
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
  const [lastUrl, setLastUrl] = useState3();
  const [hasTracked, setHasTracked] = useState3(false);
  const wrapperEl = useRef(null);
  const disconnect = useRef();
  useEffect3(() => {
    const urlHasChanged = lastUrl !== currentUrl;
    if (urlHasChanged) {
      setHasTracked(false);
      setLastUrl(currentUrl);
    }
  }, [currentUrl, lastUrl]);
  useEffect3(() => {
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
  const element = createElement2(tagName, { ...debugProps, ...rest, ref: wrapperEl }, children);
  return element;
};

// src/components/TrackFragment.tsx
import React7 from "react";
import { useEffect as useEffect4, useState as useState4 } from "react";
var TrackFragment = ({ behavior, children }) => {
  const currentUrl = typeof document === "undefined" ? "__uniform_ssr_url" : document.location.href;
  const { context } = useUniformContext();
  const insidePersonalizeComponent = useIsPersonalized();
  const [lastUrl, setLastUrl] = useState4();
  const [hasTracked, setHasTracked] = useState4(false);
  useEffect4(() => {
    const urlHasChanged = lastUrl !== currentUrl;
    if (urlHasChanged) {
      setHasTracked(false);
      setLastUrl(currentUrl);
    }
  }, [currentUrl, lastUrl]);
  useEffect4(() => {
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
  return /* @__PURE__ */ React7.createElement(React7.Fragment, null, children);
};

// src/components/UniformContext.tsx
import { SERVER_STATE_ID } from "@uniformdev/context";
import cookie from "cookie";
import React8, { useEffect as useEffect5 } from "react";
var UniformContext = ({
  context,
  children,
  outputType = "standard",
  trackRouteOnRender = true,
  includeTransferState = "server-only"
}) => {
  useEffect5(() => {
    if (isServer || !trackRouteOnRender) {
      return;
    }
    context.update({
      url: new URL(window.location.href),
      cookies: cookie.parse(document.cookie)
    });
  });
  const showTransferState = includeTransferState === "always" || includeTransferState === "server-only" && isServer;
  return /* @__PURE__ */ React8.createElement(UniformContextContext.Provider, { value: { context, outputType } }, children, showTransferState ? /* @__PURE__ */ React8.createElement(TransferState, null) : null);
};
function TransferState() {
  const { context } = useUniformContext();
  const transferState = context.getServerToClientTransitionState();
  return /* @__PURE__ */ React8.createElement(
    "script",
    {
      id: SERVER_STATE_ID,
      type: "application/json",
      dangerouslySetInnerHTML: {
        __html: JSON.stringify(transferState)
      }
    }
  );
}
export {
  Personalize,
  Test,
  Track,
  TrackFragment,
  UniformContext,
  useQuirks,
  useScores,
  useUniformContext
};
