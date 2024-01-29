// src/enableNextSsr.tsx
import { parse } from "cookie";
import * as React from "react";
function enableNextSsr(ctx, context) {
  var _a;
  const originalRenderPage = ctx.renderPage;
  const { req } = ctx;
  if (req) {
    context.update({
      // note: https and unknown here are ok, because nothing is matching on host or protocol in the tracker
      url: new URL(`https://${(_a = req.headers.host) != null ? _a : "unknown"}${req.url}`),
      cookies: req.headers.cookie ? parse(req.headers.cookie) : void 0
    });
  }
  ctx.renderPage = (opts) => originalRenderPage({
    ...opts,
    enhanceApp: (App) => {
      const UniformSSREnhancer = (props) => {
        return /* @__PURE__ */ React.createElement(App, { ...props, serverUniformContext: context });
      };
      return UniformSSREnhancer;
    }
  });
}

// src/NextCookieTransitionDataStore.ts
import {
  CookieTransitionDataStore,
  UNIFORM_DEFAULT_COOKIE_NAME
} from "@uniformdev/context";
import { parse as parse2 } from "cookie";
var NextCookieTransitionDataStore = class extends CookieTransitionDataStore {
  constructor({ serverContext, ...options }) {
    super({
      ...options,
      serverCookieValue: getNextServerCookieValue(serverContext)
    });
  }
};
function getNextServerCookieValue(serverContext, cookieName = UNIFORM_DEFAULT_COOKIE_NAME) {
  var _a, _b, _c;
  if (!serverContext)
    return void 0;
  let cookies = parse2((_b = (_a = serverContext.req) == null ? void 0 : _a.headers.cookie) != null ? _b : "");
  if ((_c = serverContext == null ? void 0 : serverContext.res) == null ? void 0 : _c.getHeaders) {
    const resHeaders = serverContext.res.getHeaders();
    const resCookies = resHeaders["set-cookie"];
    if (resCookies) {
      cookies = { ...cookies, ...parse2(Array.isArray(resCookies) ? resCookies[0] : resCookies.toString()) };
    }
  }
  return cookies[cookieName];
}
export {
  NextCookieTransitionDataStore,
  enableNextSsr
};
