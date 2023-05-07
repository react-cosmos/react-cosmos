import React from 'react';
import { RendererConnect, RendererSearchParams } from 'react-cosmos-core';

export type RendererContextValue = {
  rendererId: string;
  rendererConnect: RendererConnect;
  searchParams: RendererSearchParams;
  setSearchParams(nextParams: RendererSearchParams): void;
  reloadRenderer(): void;
};

export const RendererContext = React.createContext<RendererContextValue>({
  rendererId: 'default-renderer-id',
  rendererConnect: {
    postMessage: () => {},
    onMessage: () => () => {},
  },
  searchParams: {},
  setSearchParams: () => {},
  reloadRenderer: () => {},
});
