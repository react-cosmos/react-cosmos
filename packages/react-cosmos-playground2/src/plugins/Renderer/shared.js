// @flow

import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { RendererId, FixtureNames } from 'react-cosmos-shared2/renderer';

export type RendererConfig = {
  webUrl: null | string,
  enableRemote: boolean
};

export type RendererItemState = {
  fixtures: FixtureNames,
  fixtureState: null | FixtureState
};

export type RendererState = {
  primaryRendererId: null | RendererId,
  renderers: {
    [rendererId: RendererId]: RendererItemState
  }
};
