// @flow

import type { FixtureState, SetFixtureState } from 'react-cosmos-shared2';

export type PlaygroundOptions = {
  rendererUrl: string
};

// TODO
// export type UrlParams = {};
// export type SetUrlParams = ($Shape<UrlParams>) => mixed;
// export type UiState = {};
// export type PluginState = { [prop: string]: mixed };
// export type SetPluginState = ($Shape<PluginState>) => mixed;

export type PlaygroundContextValue = {
  options: PlaygroundOptions,
  // TODO
  // urlParams: UrlParams,
  // setUrlParams: SetUrlParams,
  // uiState: UiState,
  // pluginState: PluginState,
  // setPluginState: SetPluginState,
  fixtureState: ?FixtureState,
  setFixtureState: SetFixtureState
};
