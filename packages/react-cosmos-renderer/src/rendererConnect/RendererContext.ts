import React from 'react';
import {
  FixtureList,
  RendererConnect,
  RendererParams,
} from 'react-cosmos-core';

export type RendererContextValue = {
  rendererId: string;
  rendererConnect: RendererConnect;
  params: RendererParams;
  setParams(nextParams: RendererParams): void;
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
  params: {},
  setParams: () => {},
  reloadRenderer: () => {},
  lazyItems: {},
  setLazyItems: () => {},
});
