'use client';
import React from 'react';
import { isInsideWindowIframe } from 'react-cosmos-core';
import {
  createNoopRendererConnect,
  createPostMessageConnect,
  createWebSocketsConnect,
  createWindowRendererConnect,
} from 'react-cosmos-renderer';

type DomRendererConnectOptions = {
  webSocketUrl?: string | null;
  detached?: boolean;
};

export function useDomRendererConnect({
  webSocketUrl,
  detached,
}: DomRendererConnectOptions) {
  return React.useMemo(
    () => createDomRendererConnect({ webSocketUrl, detached }),
    [webSocketUrl, detached]
  );
}

// A detached renderer is disconnected from the Cosmos UI and the dev server
// and only responds to window hooks, which is how headless browsers control it
export function createDomRendererConnect({
  webSocketUrl,
  detached = false,
}: DomRendererConnectOptions) {
  if (typeof window === 'undefined') return createNoopRendererConnect();

  if (!detached) {
    if (isInsideWindowIframe()) return createPostMessageConnect();
    if (webSocketUrl) return createWebSocketsConnect(webSocketUrl);
  }

  return createWindowRendererConnect();
}
