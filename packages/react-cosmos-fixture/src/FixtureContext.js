// @flow

import { createContext } from 'react';

import type { FixtureState, FixtureContextValue } from './types/fixtureState';

export const EMPTY_FIXTURE_STATE: FixtureState = {};

const initialFixtureContext: FixtureContextValue = {
  fixtureState: EMPTY_FIXTURE_STATE,
  setFixtureState: () => {}
};

export const FixtureContext = createContext(initialFixtureContext);
