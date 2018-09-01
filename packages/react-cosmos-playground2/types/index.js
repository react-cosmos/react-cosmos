// @flow

import type { SetState } from 'react-cosmos-shared2/util';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type {
  FixtureNames,
  RendererRequest
} from 'react-cosmos-shared2/renderer';

export type PlaygroundOptions = {
  rendererUrl: string
};

export type UiState = {
  fixtures: FixtureNames,
  // TODO: Move fixturePath to urlParams when adding router
  fixturePath: ?string
};

export type ReplaceFixtureState = (FixtureState, cb?: () => mixed) => mixed;

export type RendererRequestListener = RendererRequest => mixed;

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
  replaceFixtureState: ReplaceFixtureState,
  postRendererRequest: RendererRequest => mixed,
  // Returns unsubscribe function
  onRendererRequest: RendererRequestListener => () => mixed
};
