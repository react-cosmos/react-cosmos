'use client';
import React from 'react';
import { isInsideWindowIframe } from 'react-cosmos-core';
import {
  createNoopRendererConnect,
  createPostMessageConnect,
  createWebSocketsConnect,
} from 'react-cosmos-renderer';

export function useDomRendererConnect(
  webSocketUrl: string | null,
  detached: boolean
) {
  return React.useMemo(
    () => createDomRendererConnect(webSocketUrl, detached),
    [webSocketUrl, detached]
  );
}

// A detached renderer is disconnected from the Cosmos UI and the dev server
// and only responds to window hooks, which is how headless browsers control it
export function createDomRendererConnect(
  webSocketUrl: string | null,
  detached: boolean
) {
  if (typeof window !== 'undefined' && !detached) {
    if (isInsideWindowIframe()) return createPostMessageConnect();
    if (webSocketUrl) return createWebSocketsConnect(webSocketUrl);
  }

  return createNoopRendererConnect();
}
