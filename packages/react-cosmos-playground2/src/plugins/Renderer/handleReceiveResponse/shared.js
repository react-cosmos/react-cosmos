// @flow

import { getUrlParams } from '../shared/router';
import { postSelectFixtureRequest } from '../shared/postRequest';

import type { RendererId } from 'react-cosmos-shared2/renderer';
import type { RendererContext } from '../shared';

export function selectFixtureFromUrlParams(
  context: RendererContext,
  rendererId: RendererId
) {
  const { fixturePath } = getUrlParams(context);

  if (fixturePath) {
    const { fixtureState } = context.getState().renderers[rendererId];
    postSelectFixtureRequest(context, rendererId, fixturePath, fixtureState);
  }
}
