import { FixtureId, FixtureState } from 'react-cosmos-core';
import { RendererCoreContext } from './shared/index.js';
import { postSelectFixtureRequest } from './shared/postRequest.js';

export function onRouterFixtureSelect(
  context: RendererCoreContext,
  fixtureId: FixtureId
) {
  context.setState(
    prevState => ({ ...prevState, fixtureState: {} }),
    () => {
      const {
        connectedRendererIds,
        initialFixtureStateUpdaters: initialFixtureStateUpdaters,
      } = context.getState();
      connectedRendererIds.forEach(rendererId => {
        let initialFixtureState: FixtureState = {};
        initialFixtureStateUpdaters.forEach(initialFixtureStateUpdater => {
          initialFixtureState = initialFixtureStateUpdater(initialFixtureState);
        });
        postSelectFixtureRequest(
          context,
          rendererId,
          fixtureId,
          initialFixtureState
        );
      });
    }
  );
}
