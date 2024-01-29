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
  NextCookieTransitionDataStore: () => NextCookieTransitionDataStore,
  enableNextSsr: () => enableNextSsr
});
module.exports = __toCommonJS(src_exports);

// src/enableNextSsr.tsx
var import_cookie = require("cookie");
var React = __toESM(require("react"));
function enableNextSsr(ctx, context) {
  var _a;
  const originalRenderPage = ctx.renderPage;
  const { req } = ctx;
  if (req) {
    context.update({
      // note: https and unknown here are ok, because nothing is matching on host or protocol in the tracker
      url: new URL(`https://${(_a = req.headers.host) != null ? _a : "unknown"}${req.url}`),
      cookies: req.headers.cookie ? (0, import_cookie.parse)(req.headers.cookie) : void 0
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
var import_context = require("@uniformdev/context");
var import_cookie2 = require("cookie");
var NextCookieTransitionDataStore = class extends import_context.CookieTransitionDataStore {
  constructor({ serverContext, ...options }) {
    super({
      ...options,
      serverCookieValue: getNextServerCookieValue(serverContext)
    });
  }
};
function getNextServerCookieValue(serverContext, cookieName = import_context.UNIFORM_DEFAULT_COOKIE_NAME) {
  var _a, _b, _c;
  if (!serverContext)
    return void 0;
  let cookies = (0, import_cookie2.parse)((_b = (_a = serverContext.req) == null ? void 0 : _a.headers.cookie) != null ? _b : "");
  if ((_c = serverContext == null ? void 0 : serverContext.res) == null ? void 0 : _c.getHeaders) {
    const resHeaders = serverContext.res.getHeaders();
    const resCookies = resHeaders["set-cookie"];
    if (resCookies) {
      cookies = { ...cookies, ...(0, import_cookie2.parse)(Array.isArray(resCookies) ? resCookies[0] : resCookies.toString()) };
    }
  }
  return cookies[cookieName];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NextCookieTransitionDataStore,
  enableNextSsr
});
