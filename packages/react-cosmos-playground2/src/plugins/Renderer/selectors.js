// @flow

import type { RendererState, RendererItemState } from './shared';

export function getPrimaryRendererState({
  primaryRendererId,
  renderers
}: RendererState): null | RendererItemState {
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
