'use client';
import React from 'react';
import type { RendererConnect } from 'react-cosmos-core';
import { isInsideWindowIframe } from 'react-cosmos-core';
import {
  createNoopRendererConnect,
  createPostMessageConnect,
  createWebSocketsConnect,
  createWindowRendererConnect,
} from 'react-cosmos-renderer';

type DomRendererConnectOptions = {
  webSocketUrl: string | null;
  detached?: boolean;
};

export function useDomRendererConnect(
  options: DomRendererConnectOptions
): RendererConnect;
/** @deprecated Pass an options object */
export function useDomRendererConnect(
  webSocketUrl: string | null
): RendererConnect;
export function useDomRendererConnect(
  optionsOrWebSocketUrl: DomRendererConnectOptions | string | null
) {
  // Cosmos packages older than 7.5 depend on this package with a caret range,
  // so they can end up calling this version with the positional webSocketUrl
  // argument they were built against. See the tech debt doc for when this can
  // be removed.
  const options: DomRendererConnectOptions =
    typeof optionsOrWebSocketUrl === 'string' || optionsOrWebSocketUrl === null
      ? { webSocketUrl: optionsOrWebSocketUrl }
      : optionsOrWebSocketUrl;
  const { webSocketUrl, detached } = options;

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
