import { Context, CookieTransitionDataStoreOptions, CookieTransitionDataStore } from '@uniformdev/context';
import { AppProps } from 'next/app';
import { DocumentContext } from 'next/document';
import { NextPageContext } from 'next';

/**
 * Enables request-data tracking during server-side rendering passes,
 * and sending that data back up to the client.
 *
 * This function must be called in a custom Next _document's `getInitialProps`
 * function to work properly.
 */
declare function enableNextSsr(ctx: DocumentContext, context: Context): void;
/** Type of <App> props if enableNextSsr() is setup in _document. */
type UniformAppProps<P = {}> = AppProps<P> & {
    serverUniformContext?: Context;
};

type NextCookieTransitionDataStoreOptions = Omit<CookieTransitionDataStoreOptions, 'serverCookieValue'> & {
    serverContext: NextPageContext | undefined;
};
/**
 * Provides client-to-server score transition using cookies for Next.js SSR
 */
declare class NextCookieTransitionDataStore extends CookieTransitionDataStore {
    constructor({ serverContext, ...options }: NextCookieTransitionDataStoreOptions);
}

export { NextCookieTransitionDataStore, type NextCookieTransitionDataStoreOptions, type UniformAppProps, enableNextSsr };
