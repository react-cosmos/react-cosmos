// @flow

import { createContext } from 'react';

import type { FixtureContextValue } from './index.js.flow';

export const FixtureContext = createContext<FixtureContextValue>({
  fixtureState: null,
  setFixtureState: () => {}
});
