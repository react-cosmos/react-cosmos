// @flow

import { createContext } from 'react';

import type { FixtureContextValue } from '../types/fixtureState';

export const FixtureContext = createContext<FixtureContextValue>({
  fixtureState: null,
  setFixtureState: () => {}
});
