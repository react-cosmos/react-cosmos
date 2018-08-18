// @flow

import { createContext } from 'react';

import type { FixtureData, FixtureContextValue } from './types';

export const EMPTY_FIXTURE_DATA: FixtureData = {};

const initialFixtureContext: FixtureContextValue = {
  fixtureData: EMPTY_FIXTURE_DATA,
  updateFixtureData: () => {}
};

export const FixtureContext = createContext(initialFixtureContext);
