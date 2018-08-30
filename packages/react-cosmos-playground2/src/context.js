// @flow

import { createContext } from 'react';

import type { PlaygroundContextValue } from '../types';

export const PlaygroundContext = createContext<PlaygroundContextValue>({
  options: {
    rendererUrl: ''
  },
  fixtureState: null,
  setFixtureState: () => {}
});
