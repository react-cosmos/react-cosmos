// @flow

import { createContext } from 'react';

import type { FixtureContextValue } from './types/fixtureState';

const initialFixtureContext: FixtureContextValue = {
  fixtureState: null,
  setFixtureState: () => {}
};

export const FixtureContext = createContext(initialFixtureContext);
