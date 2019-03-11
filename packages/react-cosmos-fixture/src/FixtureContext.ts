import { createContext } from 'react';
import { FixtureContextValue } from './types';

export const FixtureContext = createContext<FixtureContextValue>({
  fixtureState: null,
  setFixtureState: () => {}
});
