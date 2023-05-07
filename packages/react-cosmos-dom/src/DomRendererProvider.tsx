'use client';
import React from 'react';
import {
  RendererConfig,
  RendererSearchParams,
  StringRendererSearchParams,
  decodeRendererSearchParams,
  encodeRendererSearchParams,
  isInsideWindowIframe,
} from 'react-cosmos-core';
import {
  createNoopRendererConnect,
  createPostMessageConnect,
  createWebSocketsConnect,
} from 'react-cosmos-renderer';
import {
  RendererContext,
  RendererContextValue,
} from 'react-cosmos-renderer/client';
import { getDomRendererId } from './domRendererId.js';

type Props = {
  children: React.ReactNode;
  rendererConfig: RendererConfig;
  searchParams: StringRendererSearchParams;
  setSearchParams?: (nextParams: StringRendererSearchParams) => void;
};
export function DomRendererProvider({
  children,
  rendererConfig,
  searchParams,
  setSearchParams,
}: Props) {
  const value = React.useMemo<RendererContextValue>(() => {
    return {
      rendererConfig,
      rendererId: getDomRendererId(),
      rendererConnect: createDomRendererConnect(rendererConfig.playgroundUrl),
      searchParams: decodeRendererSearchParams(searchParams),
      setSearchParams: (nextParams: RendererSearchParams) => {
        // Implementing setSearchParams is optional. In is required for server
        // fixture loaders that cannot listen to client-side 'selectFixture'
        // requests from the Cosmos UI.
        if (setSearchParams) {
          setSearchParams(encodeRendererSearchParams(nextParams));
        }
      },
      reloadRenderer: () => {
        window.location.reload();
      },
    };
  }, [setSearchParams, rendererConfig, searchParams]);

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
