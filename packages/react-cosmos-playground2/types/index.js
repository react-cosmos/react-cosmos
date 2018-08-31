// @flow

import type {
  SetState,
  FixtureState,
  FixtureNames,
  RemoteMessage
} from 'react-cosmos-shared2';

export type PlaygroundOptions = {
  rendererUrl: string
};

export type UiState = {
  fixtures: FixtureNames,
  // TODO: Move fixturePath to urlParams when adding router
  fixturePath: ?string
};

export type RemoteListener = RemoteMessage => mixed;
export type OnRemoteMessage =
  // Returns unsubscribe fn
  RemoteListener => () => mixed;

// TODO: Add remaining context fields
// export type UrlParams = {};
// export type SetUrlParams = ($Shape<UrlParams>) => mixed;
// export type PluginState = { [prop: string]: mixed };
// export type SetPluginState = ($Shape<PluginState>) => mixed;

export type PlaygroundContextValue = {
  options: PlaygroundOptions,
  uiState: UiState,
  setUiState: SetState<UiState>,
  fixtureState: ?FixtureState,
  setFixtureState: SetState<FixtureState>,
  postMessage: RemoteMessage => mixed,
  // Less common API for plugins that orchestrate communication with renderers
  onMessage: OnRemoteMessage
};
