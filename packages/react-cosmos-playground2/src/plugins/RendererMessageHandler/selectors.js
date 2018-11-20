// @flow

import type { RendererState, RendererStates } from './shared';

export function getSelRendererState(
  rendererStates: RendererStates
): null | RendererState {
  const rendererIds = Object.keys(rendererStates);

  if (rendererIds.length === 0) {
    return null;
  }

  // NOTE: This merely selects the first renderer state. No better heuristic
  // comes to mind, because renderer states are kept in sync. Possible
  // alternative: Keep selectedRendererId in state (and possibly allow user to
  // select from dropdown). But no existing use case benefits from this for now.
  const [selRendererId] = rendererIds;

  return rendererStates[selRendererId];
}
