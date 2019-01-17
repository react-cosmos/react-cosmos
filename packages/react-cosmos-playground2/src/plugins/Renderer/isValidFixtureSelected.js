// @flow

import { getUrlParams } from './shared/router';

import type { RendererContext } from './shared';

export function isValidFixtureSelected(context: RendererContext) {
  const { fixturePath } = getUrlParams(context);

  return (
    fixturePath !== undefined &&
    context.getState().fixtures.indexOf(fixturePath) !== -1
  );
}
