// @flow

import type { RenderersState } from './shared';

export function getInitialState(): RenderersState {
  return {
    primaryRendererId: null,
    renderers: {}
  };
}
