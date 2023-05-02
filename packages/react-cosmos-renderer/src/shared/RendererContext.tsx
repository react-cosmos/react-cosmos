'use client';
import React from 'react';
import { RendererConnect } from 'react-cosmos-core';
import { createPostMessageConnect } from '../client/createPostMessageConnect.js';

type RendererContext = {
  rendererId: string;
  rendererConnect: RendererConnect;
  //
};

export const RendererContext = React.createContext<RendererContext>({
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
export function RendererContextProvider({
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
    <RendererContext.Provider value={value}>
      {children}
    </RendererContext.Provider>
  );
}
