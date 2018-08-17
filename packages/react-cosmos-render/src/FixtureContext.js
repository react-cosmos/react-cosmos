// @flow

import { createContext } from 'react';

import type { FixtureData, UpdateFixtureData } from './types';

export const EMPTY_FIXTURE_DATA: FixtureData = {};

const updateFixtureData: UpdateFixtureData = () => {};

export const FixtureContext = createContext({
  fixtureData: EMPTY_FIXTURE_DATA,
  updateFixtureData
});
