// @flow

import type { RendererState } from './shared';

export function getInitialState(): RendererState {
  return {
    rendererIds: [],
    fixtures: [],
    fixtureState: null
  };
}
