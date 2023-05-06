import React from 'react';
import { FixtureId, RendererConfig, RendererConnect } from 'react-cosmos-core';

export type RendererContextValue = {
  rendererConfig: RendererConfig;
  rendererId: string;
  rendererConnect: RendererConnect;
  lockedFixture: boolean;
  reloadRenderer: (fixtureId: FixtureId | null) => void;
};

export const RendererContext = React.createContext<RendererContextValue>({
  rendererConfig: {
    playgroundUrl: 'http://localhost:5000',
    reloadOnFixtureChange: false,
  },
  rendererId: 'default-renderer-id',
  rendererConnect: {
    postMessage: () => {},
    onMessage: () => () => {},
  },
  lockedFixture: false,
  reloadRenderer: () => {},
});
