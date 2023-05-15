import React from 'react';
import {
  FixtureId,
  FixtureList,
  FixtureState,
  RendererConnect,
} from 'react-cosmos-core';

export type SelectedFixture = {
  fixtureId: FixtureId;
  initialFixtureState: FixtureState;
  renderKey: number;
};

export type RendererContextValue = {
  rendererId: string;
  rendererConnect: RendererConnect;
  locked: boolean;
  selectedFixture: SelectedFixture | null;
  setSelectedFixture: React.Dispatch<
    React.SetStateAction<SelectedFixture | null>
  >;
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
  locked: false,
  selectedFixture: null,
  setSelectedFixture: () => {},
  reloadRenderer: () => {},
  lazyItems: {},
  setLazyItems: () => {},
});
