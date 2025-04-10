'use client';
import React from 'react';
import { isInsideWindowIframe } from 'react-cosmos-core';
import {
  createNoopRendererConnect,
  createPostMessageConnect,
  createWebSocketsConnect,
} from 'react-cosmos-renderer';

export function useDomRendererConnect(webSocketUrl: string | null) {
  return React.useMemo(
    () => createDomRendererConnect(webSocketUrl),
    [webSocketUrl]
  );
}

function createDomRendererConnect(webSocketUrl: string | null) {
  if (typeof window !== 'undefined') {
    if (isInsideWindowIframe()) return createPostMessageConnect();
    if (webSocketUrl) return createWebSocketsConnect(webSocketUrl);
  }

  return createNoopRendererConnect();
}
