'use client';
import React from 'react';
import { RendererConnect } from 'react-cosmos-core';

type RendererContextValue = {
  rendererId: string;
  rendererConnect: RendererConnect;
};

export const RendererContext = React.createContext<RendererContextValue>({
  rendererId: 'defaultRendererId',
  rendererConnect: {
    postMessage: () => {},
    onMessage: () => () => {},
  },
});

type ProviderProps = {
  children: React.ReactNode;
  rendererId: string;
  rendererConnect: RendererConnect;
};
export function RendererProvider({
  children,
  rendererId,
  rendererConnect,
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
