import { createContext } from 'react';
import { FixtureState, SetFixtureState } from '../shared/fixtureState/types.js';

export type FixtureContextValue = {
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
};

export const FixtureContext = createContext<FixtureContextValue>({
  fixtureState: {},
  setFixtureState: () => {},
});
