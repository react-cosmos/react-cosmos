import { FixtureId } from 'react-cosmos-core';
import { RendererCoreContext } from './shared/index.js';
import { postSelectFixtureRequest } from './shared/postRequest.js';

export function onRouterFixtureReselect(
  context: RendererCoreContext,
  fixtureId: FixtureId
) {
  const { connectedRendererIds } = context.getState();
  connectedRendererIds.forEach(rendererId => {
    postSelectFixtureRequest(context, rendererId, fixtureId, {});
  });
}
