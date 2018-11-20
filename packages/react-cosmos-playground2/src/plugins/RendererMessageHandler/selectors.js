// @flow

import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { RendererState, RenderersState } from './shared';

export function getExistingFixtureState(
  renderersState: RenderersState
): null | FixtureState {
  const primaryRendererState = getPrimaryRendererState(renderersState);

  return primaryRendererState ? primaryRendererState.fixtureState : null;
}

export function getPrimaryRendererState({
  primaryRendererId,
  renderers
}: RenderersState): null | RendererState {
  if (!primaryRendererId) {
    return null;
  }

  if (!renderers[primaryRendererId]) {
    throw new Error(
      `primaryRendererId "${primaryRendererId}" points to missing renderer state`
    );
  }

  return renderers[primaryRendererId];
}
