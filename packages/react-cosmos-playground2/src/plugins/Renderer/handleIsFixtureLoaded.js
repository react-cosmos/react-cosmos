// @flow

import { getPrimaryRendererState } from './shared';

import type { RendererContext } from './shared';

export function handleIsFixtureLoaded({ getState }: RendererContext) {
  const primaryRendererState = getPrimaryRendererState(getState());

  return primaryRendererState
    ? primaryRendererState.fixtureState !== null
    : false;
}
