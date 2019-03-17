import * as React from 'react';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';

// Make latest fixture state accessible in hooks callbacks
export function useFixtureStateRef(fixtureState: FixtureState) {
  const fixtureStateRef = React.useRef(fixtureState);
  React.useEffect(() => {
    fixtureStateRef.current = fixtureState;
  });
  return fixtureStateRef;
}
