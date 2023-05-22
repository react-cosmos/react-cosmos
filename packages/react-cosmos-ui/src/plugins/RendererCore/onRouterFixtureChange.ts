import { FixtureId } from 'react-cosmos-core';
import { RendererCoreContext } from './shared/index.js';
import {
  postSelectFixtureRequest,
  postUnselectFixtureRequest,
} from './shared/postRequest.js';

export function onRouterFixtureChange(
  context: RendererCoreContext,
  fixtureId: null | FixtureId
) {
  const { connectedRendererIds } = context.getState();
  connectedRendererIds.forEach(rendererId => {
    if (fixtureId !== null) {
      postSelectFixtureRequest(context, rendererId, fixtureId, {});
    } else {
      postUnselectFixtureRequest(context, rendererId);
    }
  });
}
