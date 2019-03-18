import * as React from 'react';
import { isEqual } from 'lodash';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';

export type ElRefs = { [elPath: string]: React.Component };

export type InitialStates = {
  [elPath: string]: {
    type: React.ComponentClass<any>;
    // "The state [...] should be a plain JavaScript object."
    // https://reactjs.org/docs/react-component.html#state
    state: {};
  };
};

export type CachedRefHandler = {
  origRef: null | React.Ref<any>;
  handler: (elRef: null | React.Component) => unknown;
};

export type CachedRefHandlers = {
  [elPath: string]: CachedRefHandler;
};

// Make latest fixture state accessible in hooks callbacks
export function useFixtureStateRef(fixtureState: FixtureState) {
  const ref = React.useRef(fixtureState);
  React.useEffect(() => {
    ref.current = fixtureState;
  });
  return ref;
}

export function useUnmount(cb: () => void) {
  React.useEffect(() => cb, []);
}

// We need to do this because React doesn't provide a replaceState method
// (anymore) https://reactjs.org/docs/react-component.html#setstate
export function replaceState(elRef: React.Component, nextState: {}) {
  const fullState = resetOriginalKeys(elRef.state, nextState);
  if (!isEqual(fullState, elRef.state)) {
    elRef.setState(fullState);
  }
}

function resetOriginalKeys(original: {}, current: {}): {} {
  return Object.keys(original).reduce(
    (result: {}, key) =>
      Object.keys(result).indexOf(key) === -1
        ? { ...result, [key]: undefined }
        : result,
    current
  );
}
