import { createContext } from 'react';
import { FixtureContextValue } from './shared';

export const FixtureContext = createContext<FixtureContextValue>({
  fixtureState: {},
  setFixtureState: () => {}
});
