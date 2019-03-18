import * as React from 'react';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';

// Make latest fixture state accessible in hooks callbacks
export function useFixtureStateRef(fixtureState: FixtureState) {
  const ref = React.useRef(fixtureState);
  React.useEffect(() => {
    ref.current = fixtureState;
  });
  return ref;
}
