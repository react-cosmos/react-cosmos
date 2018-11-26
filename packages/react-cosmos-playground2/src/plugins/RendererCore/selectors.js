// @flow

import type { RendererState, RenderersState } from './shared';

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
