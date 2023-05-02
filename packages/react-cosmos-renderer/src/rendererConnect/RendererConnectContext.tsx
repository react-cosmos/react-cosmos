'use client';
import React from 'react';
import { RendererConnect } from 'react-cosmos-core';
import { createPostMessageConnect } from './createPostMessageConnect.js';

type RendererConnectContext = {
  rendererId: string;
  rendererConnect: RendererConnect;
};

export const RendererConnectContext =
  React.createContext<RendererConnectContext>({
    rendererId: 'defaultRendererId',
    rendererConnect: {
      postMessage: () => {},
      onMessage: () => () => {},
    },
  });

type ProviderProps = {
  children: React.ReactNode;
  rendererId: string;
  rendererConnect?: RendererConnect;
};
export function RendererConnectProvider({
  children,
  rendererId,
  // TODO: Decide based on environment (iframe, root window, server);
  rendererConnect = createPostMessageConnect(),
}: ProviderProps) {
  const value = React.useMemo(
    () => ({ rendererId, rendererConnect }),
    [rendererConnect, rendererId]
  );
  return (
    <RendererConnectContext.Provider value={value}>
      {children}
    </RendererConnectContext.Provider>
  );
}
