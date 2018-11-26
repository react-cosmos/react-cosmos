// @flow

let initialStateGetters = {};

export function registerInitialPluginState(
  pluginName: string,
  getter: () => any
) {
  initialStateGetters = {
    ...initialStateGetters,
    [pluginName]: getter
  };
}

export function getInitialPluginState() {
  return Object.keys(initialStateGetters).reduce((initialState, pluginName) => {
    return {
      ...initialState,
      [pluginName]: initialStateGetters[pluginName]()
    };
  }, {});
}
