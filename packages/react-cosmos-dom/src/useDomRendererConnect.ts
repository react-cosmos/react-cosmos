'use client';
import React from 'react';
import { RendererConfig, isInsideWindowIframe } from 'react-cosmos-core';
import {
  createNoopRendererConnect,
  createPostMessageConnect,
  createWebSocketsConnect,
} from 'react-cosmos-renderer';

export function useDomRendererConnect(rendererConfig: RendererConfig) {
  return React.useMemo(
    () => createDomRendererConnect(rendererConfig.playgroundUrl),
    [rendererConfig.playgroundUrl]
  );
}

function createDomRendererConnect(playgroundUrl: string) {
  // TODO: Don't try to connect to WS in static exports.
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
