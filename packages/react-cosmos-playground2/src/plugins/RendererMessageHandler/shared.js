// @flow

import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { RendererId, FixtureNames } from 'react-cosmos-shared2/renderer';

export type RendererState = {
  fixtures: FixtureNames,
  fixtureState: null | FixtureState
};

export type RenderersState = {
  primaryRendererId: null | RendererId,
  renderers: {
    [rendererId: RendererId]: RendererState
  }
};
