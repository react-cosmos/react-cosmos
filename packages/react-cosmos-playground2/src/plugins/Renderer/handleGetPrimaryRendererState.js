// @flow

import { getPrimaryRendererState } from './shared';

import type { RendererContext } from './shared';

export function handleGetPrimaryRendererState({ getState }: RendererContext) {
  return getPrimaryRendererState(getState());
}
