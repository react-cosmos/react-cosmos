import { FixtureId } from 'react-cosmos-core';
import { RendererCoreContext } from './shared/index.js';
import { postSelectFixtureRequest } from './shared/postRequest.js';

export function onRouterFixtureSelect(
  context: RendererCoreContext,
  fixtureId: FixtureId
) {
  context.setState(
    prevState => ({ ...prevState, fixtureState: {} }),
    () => {
      const { connectedRendererIds } = context.getState();
      connectedRendererIds.forEach(rendererId => {
        postSelectFixtureRequest(context, rendererId, fixtureId, {});
      });
    }
  );
}
