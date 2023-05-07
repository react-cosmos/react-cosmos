import React from 'react';
import {
  FixtureList,
  RendererConnect,
  RendererSearchParams,
} from 'react-cosmos-core';

export type RendererContextValue = {
  rendererId: string;
  rendererConnect: RendererConnect;
  searchParams: RendererSearchParams;
  setSearchParams(nextParams: RendererSearchParams): void;
  reloadRenderer(): void;
  lazyItems: FixtureList;
  setLazyItems: React.Dispatch<React.SetStateAction<FixtureList>>;
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
  lazyItems: {},
  setLazyItems: () => {},
});
