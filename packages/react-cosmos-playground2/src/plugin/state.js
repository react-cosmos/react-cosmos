// @flow

let initialState = {};

export function registerInitialPluginState(pluginName: string, value: any) {
  initialState = {
    ...initialState,
    [pluginName]: value
  };
}

export function getInitialPluginState() {
  return initialState;
}
