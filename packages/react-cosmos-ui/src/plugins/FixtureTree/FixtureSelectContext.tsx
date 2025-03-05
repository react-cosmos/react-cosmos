import React, { useContext, useMemo } from 'react';
import { FixtureId } from 'react-cosmos-core';

type ContextValue = {
  selectFixture: (fixtureId: FixtureId) => unknown;
};

const FixtureSelectContext = React.createContext<ContextValue>({
  selectFixture: () => {},
});

export function FixtureSelectProvider(props: {
  children: React.ReactNode;
  onSelect: (fixtureId: FixtureId) => unknown;
}) {
  const value = useMemo(
    () => ({ selectFixture: props.onSelect }),
    [props.onSelect]
  );
  return (
    <FixtureSelectContext.Provider value={value}>
      {props.children}
    </FixtureSelectContext.Provider>
  );
}

export function useFixtureSelect() {
  return useContext(FixtureSelectContext);
}
