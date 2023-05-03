'use client';
import React from 'react';
import { isInsideWindowIframe } from 'react-cosmos-core';
import { RendererContext } from './RendererContext.js';
import { createNoopRendererConnect } from './createNoopRendererConnect.js';
import { createPostMessageConnect } from './createPostMessageConnect.js';
import { createWebSocketsConnect } from './createWebSocketsConnect.js';
import { getDomRendererId } from './domRendererId.js';

type Props = {
  children: React.ReactNode;
  playgroundUrl: string;
};
export function DomRendererProvider({ children, playgroundUrl }: Props) {
  const value = React.useMemo(() => {
    return {
      rendererId: getDomRendererId(),
      rendererConnect: createDomRendererConnect(playgroundUrl),
    };
  }, [playgroundUrl]);

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
