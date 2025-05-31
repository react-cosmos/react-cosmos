import React, { ReactNode, useContext, useMemo } from 'react';
import { FixtureId } from 'react-cosmos-core';

type ContextValue = {
  selectFixture: (fixtureId: FixtureId, keepDrawerNavOpen: boolean) => unknown;
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
