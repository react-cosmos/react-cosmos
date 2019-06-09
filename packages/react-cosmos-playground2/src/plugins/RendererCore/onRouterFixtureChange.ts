import { FixtureId } from 'react-cosmos-shared2/renderer';
import {
  postSelectFixtureRequest,
  postUnselectFixtureRequest
} from './shared/postRequest';
import { Context, State } from './shared';

export function onRouterFixtureChange(
  context: Context,
  fixtureId: null | FixtureId
) {
  if (fixtureId === null) {
    return context.setState(emptyFixtureState, () => {
      getConnectedRendererIds(context).forEach(rendererId =>
        postUnselectFixtureRequest(context, rendererId)
      );
    });
  }

  // Clear fixture state between fixtures
  context.setState(emptyFixtureState, () => {
    getConnectedRendererIds(context).forEach(rendererId =>
      postSelectFixtureRequest(context, rendererId, fixtureId, {})
    );
  });
}

function getConnectedRendererIds(context: Context) {
  return context.getState().connectedRendererIds;
}

function emptyFixtureState(prevState: State) {
  return { ...prevState, fixtureState: {} };
}
