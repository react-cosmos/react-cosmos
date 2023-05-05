import React from 'react';
import { FixtureId, RendererConnect } from 'react-cosmos-core';

export type RendererContextValue = {
  rendererId: string;
  rendererConnect: RendererConnect;
  reloadFixture: (fixtureId: FixtureId | null) => void;
};

export const RendererContext = React.createContext<RendererContextValue>({
  rendererId: 'default-renderer-id',
  rendererConnect: {
    postMessage: () => {},
    onMessage: () => () => {},
  },
  reloadFixture: () => {},
});
