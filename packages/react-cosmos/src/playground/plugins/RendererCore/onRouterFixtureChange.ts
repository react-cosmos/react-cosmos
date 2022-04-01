import { FixtureId } from '../../../core/types';
import { RendererCoreContext, State } from './shared';
import {
  postSelectFixtureRequest,
  postUnselectFixtureRequest,
} from './shared/postRequest';

export function onRouterFixtureChange(
  context: RendererCoreContext,
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

function getConnectedRendererIds(context: RendererCoreContext) {
  return context.getState().connectedRendererIds;
}

function emptyFixtureState(prevState: State) {
  return { ...prevState, fixtureState: {} };
}
