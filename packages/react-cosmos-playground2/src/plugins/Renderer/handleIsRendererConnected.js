// @flow

import type { RendererContext } from './shared';

export function handleIsRendererConnected({ getState }: RendererContext) {
  return Object.keys(getState().renderers).length > 0;
}
