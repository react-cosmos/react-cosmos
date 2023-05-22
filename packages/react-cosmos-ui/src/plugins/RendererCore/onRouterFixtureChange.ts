import { FixtureId } from 'react-cosmos-core';
import { RendererCoreContext, State } from './shared/index.js';
import {
  postSelectFixtureRequest,
  postUnselectFixtureRequest,
} from './shared/postRequest.js';

export function onRouterFixtureChange(
  context: RendererCoreContext,
  fixtureId: null | FixtureId,
  resetFixtureState: boolean
) {
  function postRequest() {
    const { connectedRendererIds } = context.getState();
    connectedRendererIds.forEach(rendererId => {
      if (fixtureId !== null) {
        postSelectFixtureRequest(context, rendererId, fixtureId, {});
      } else {
        postUnselectFixtureRequest(context, rendererId);
      }
    });
  }

  if (resetFixtureState) {
    context.setState(emptyFixtureState, postRequest);
  } else {
    postRequest();
  }
}

function emptyFixtureState(prevState: State) {
  return { ...prevState, fixtureState: {} };
}
