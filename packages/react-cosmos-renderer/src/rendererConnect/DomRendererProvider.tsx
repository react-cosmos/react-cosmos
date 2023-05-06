'use client';
import React from 'react';
import {
  RendererConfig,
  StringRendererSearchParams,
  decodeRendererSearchParams,
  encodeRendererSearchParams,
  isInsideWindowIframe,
} from 'react-cosmos-core';
import { RendererContext, RendererContextValue } from './RendererContext.js';
import { createNoopRendererConnect } from './createNoopRendererConnect.js';
import { createPostMessageConnect } from './createPostMessageConnect.js';
import { createWebSocketsConnect } from './createWebSocketsConnect.js';
import { getDomRendererId } from './domRendererId.js';

type Props = {
  children: React.ReactNode;
  rendererConfig: RendererConfig;
  searchParams: StringRendererSearchParams;
  onSearchParams: (queryParams: StringRendererSearchParams) => void;
};
export function DomRendererProvider({
  children,
  rendererConfig,
  searchParams,
  onSearchParams,
}: Props) {
  const { locked = false } = decodeRendererSearchParams(searchParams);
  const value = React.useMemo<RendererContextValue>(() => {
    return {
      rendererConfig,
      rendererId: getDomRendererId(),
      rendererConnect: createDomRendererConnect(rendererConfig.playgroundUrl),
      lockedFixture: locked,
      reloadRenderer: fixtureId => {
        onSearchParams(
          fixtureId ? encodeRendererSearchParams({ fixtureId, locked }) : {}
        );
      },
    };
  }, [locked, onSearchParams, rendererConfig]);

  return (
    <RendererContext.Provider value={value}>
      {children}
      {typeof window !== 'undefined' && <GlobalErrorHandler />}
    </RendererContext.Provider>
  );
}

function GlobalErrorHandler() {
  const { rendererId, rendererConnect } = React.useContext(RendererContext);

  React.useEffect(() => {
    function handleGlobalError() {
      rendererConnect.postMessage({
        type: 'rendererError',
        payload: { rendererId },
      });
    }
    // Unhandled errors from async code will not be caught by the error event, but
    // the unhandledrejection event instead.
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleGlobalError);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleGlobalError);
    };
  }, [rendererConnect, rendererId]);

  return null;
}

function createDomRendererConnect(playgroundUrl: string) {
  if (typeof window === 'undefined') {
    return createNoopRendererConnect();
  } else {
    return isInsideWindowIframe()
      ? createPostMessageConnect()
      : createWebSocketsConnect(getWebSocketsUrl(playgroundUrl));
  }
}

function getWebSocketsUrl(playgroundUrl: string) {
  return playgroundUrl.replace(/^https?:/, 'ws:');
}
