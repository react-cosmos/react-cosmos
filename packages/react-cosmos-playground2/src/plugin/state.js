// @flow

let initialStateGetters = {};

export function registerInitialPluginState(
  stateKey: string,
  getter: () => any
) {
  initialStateGetters = {
    ...initialStateGetters,
    [stateKey]: getter
  };
}

export function getInitialPluginState() {
  return Object.keys(initialStateGetters).reduce((initialState, stateKey) => {
    return {
      ...initialState,
      [stateKey]: initialStateGetters[stateKey]()
    };
  }, {});
}
