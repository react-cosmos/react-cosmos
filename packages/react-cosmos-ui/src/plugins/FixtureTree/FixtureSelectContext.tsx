import type { ReactNode } from 'react';
import React, { useContext, useMemo } from 'react';
import type { FixtureId } from 'react-cosmos-core';

type ContextValue = {
  selectFixture: (fixtureId: FixtureId, keepNavOpen: boolean) => unknown;
};

const FixtureSelectContext = React.createContext<ContextValue>({
  selectFixture: () => {},
});

export function FixtureSelectProvider(props: {
  children: ReactNode;
  onSelect: ContextValue['selectFixture'];
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
