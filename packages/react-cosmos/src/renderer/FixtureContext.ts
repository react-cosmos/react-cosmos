import { createContext } from 'react';
import { FixtureState, SetFixtureState } from '../utils/fixtureState/types';

export type FixtureContextValue = {
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
};

export const FixtureContext = createContext<FixtureContextValue>({
  fixtureState: {},
  setFixtureState: () => {},
});
