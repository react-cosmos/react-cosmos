// @flow

import { getUrlParams } from './shared/router';
import { getPrimaryRendererState } from './shared';

import type { RendererContext } from './shared';

export function handleIsValidFixtureSelected(context: RendererContext) {
  const { fixturePath } = getUrlParams(context);

  if (fixturePath === undefined) {
    return false;
  }

  const primaryRendererState = getPrimaryRendererState(context.getState());

  return primaryRendererState
    ? primaryRendererState.fixtures.indexOf(fixturePath) !== -1
    : false;
}
