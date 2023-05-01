'use client';
import React, { useMemo } from 'react';
import { FixtureState, SetFixtureState } from 'react-cosmos-core';
import { FixtureContext } from '../client/FixtureContext.js';

type Props = {
  children: React.ReactNode;
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
  renderKey: number;
};
export function FixtureContextProvider({
  children,
  fixtureState,
  setFixtureState,
  renderKey,
}: Props) {
  // Prevent unintentional renders https://reactjs.org/docs/context.html#caveats
  const contextValue = useMemo(
    () => ({ fixtureState, setFixtureState }),
    [fixtureState, setFixtureState]
  );

  return (
    <FixtureContext.Provider
      // renderKey controls whether to reuse previous instances (and
      // transition props) or rebuild render tree from scratch
      key={renderKey}
      value={contextValue}
    >
      {children}
    </FixtureContext.Provider>
  );
}
