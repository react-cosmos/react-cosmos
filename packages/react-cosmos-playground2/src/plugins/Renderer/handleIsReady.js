// @flow

import { getPrimaryRendererState } from './shared';

import type { RendererContext } from './shared';

export function handleIsReady({ getState }: RendererContext) {
  return getPrimaryRendererState(getState()) !== null;
}
