'use client';
import React from 'react';
import { FixtureId, FixtureState, SetFixtureState } from 'react-cosmos-core';

export type FixtureContextValue = {
  fixtureId: FixtureId;
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
};

export const FixtureContext = React.createContext<FixtureContextValue>({
  fixtureId: { path: '' },
  fixtureState: {},
  setFixtureState: () => {},
});

type ProviderProps = FixtureContextValue & {
  children: React.ReactNode;
};
export function FixtureContextProvider({
  children,
  fixtureId,
  fixtureState,
  setFixtureState,
}: ProviderProps) {
  const value = React.useMemo<FixtureContextValue>(
    () => ({ fixtureId, fixtureState, setFixtureState }),
    [fixtureId, fixtureState, setFixtureState]
  );
  return (
    <FixtureContext.Provider value={value}>{children}</FixtureContext.Provider>
  );
}
