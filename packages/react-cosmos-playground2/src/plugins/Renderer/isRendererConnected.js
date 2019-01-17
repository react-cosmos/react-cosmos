// @flow

import type { RendererContext } from './shared';

export function isRendererConnected({ getState }: RendererContext) {
  return getState().connectedRendererIds.length > 0;
}
