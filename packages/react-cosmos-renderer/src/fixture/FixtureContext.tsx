'use client';
import React from 'react';
import { FixtureState, SetFixtureState } from 'react-cosmos-core';

export type FixtureContextValue = {
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
};

export const FixtureContext = React.createContext<FixtureContextValue>({
  fixtureState: {},
  setFixtureState: () => {},
});

type ProviderProps = FixtureContextValue & {
  children: React.ReactNode;
};
export function FixtureContextProvider({
  children,
  fixtureState,
  setFixtureState,
}: ProviderProps) {
  const value = React.useMemo<FixtureContextValue>(
    () => ({ fixtureState, setFixtureState }),
    [fixtureState, setFixtureState]
  );
  return (
    <FixtureContext.Provider value={value}>{children}</FixtureContext.Provider>
  );
}
