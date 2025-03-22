'use client';
import React from 'react';
import { isInsideWindowIframe } from 'react-cosmos-core';
import {
  createNoopRendererConnect,
  createPostMessageConnect,
  createWebSocketsConnect,
} from 'react-cosmos-renderer';

export function useDomRendererConnect(serverAddress: string | null) {
  return React.useMemo(
    () => createDomRendererConnect(serverAddress),
    [serverAddress]
  );
}

function createDomRendererConnect(serverAddress: string | null) {
  if (typeof window !== 'undefined') {
    if (isInsideWindowIframe()) return createPostMessageConnect();
    if (serverAddress) return createWebSocketsConnect(serverAddress);
  }

  return createNoopRendererConnect();
}
