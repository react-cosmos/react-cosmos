import React from 'react';
import { FixtureState, SetFixtureState } from 'react-cosmos-core';

export type FixtureContextValue = {
  // fixtureParams: FixtureParams;
  // setFixtureParams: (params: FixtureParams) => void;
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
  changeFixture: (path: string, name?: string) => void;
};

export const FixtureContext = React.createContext<FixtureContextValue>({
  // fixtureParams: {},
  // setFixtureParams: () => {},
  fixtureState: {},
  setFixtureState: () => {},
  changeFixture: () => {},
});
