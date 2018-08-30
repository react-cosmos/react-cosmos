// @flow

import { createContext } from 'react';

import type { FixtureContextValue } from '../types';

export const FixtureContext = createContext<FixtureContextValue>({
  fixtureState: null,
  setFixtureState: () => {}
});
