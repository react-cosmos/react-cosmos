import {
  RendererId,
  RendererReadyResponse
} from 'react-cosmos-shared2/renderer';
import { NotificationsSpec } from '../../Notifications/public';
import { Context, State } from '../shared';
import { postSelectFixtureRequest } from '../shared/postRequest';
import { getSelectedFixtureId } from '../shared/router';

export function receiveRendererReadyResponse(
  context: Context,
  { payload }: RendererReadyResponse
) {
  const { rendererId, fixtures } = payload;

  context.setState(stateUpdater, afterStateChanged);

  function stateUpdater(prevState: State) {
    // The first announced renderer becomes the primary one
    const primaryRendererId = prevState.primaryRendererId || rendererId;
    const isPrimaryRenderer = rendererId === primaryRendererId;
    const { connectedRendererIds, fixtureState } = prevState;

    return {
      ...prevState,
      connectedRendererIds: addToSet(connectedRendererIds, rendererId),
      primaryRendererId,
      fixtures,
      fixtureState: isPrimaryRenderer ? null : fixtureState
    };
  }

  function afterStateChanged() {
    selectFixtureFromUrlParams(context, rendererId);
    notifyRendererConnection(context);
  }
}

function selectFixtureFromUrlParams(context: Context, rendererId: RendererId) {
  const fixtureId = getSelectedFixtureId(context);

  if (fixtureId) {
    const { fixtureState } = context.getState();
    postSelectFixtureRequest(context, rendererId, fixtureId, fixtureState);
  }
}

function notifyRendererConnection({ getMethodsOf }: Context) {
  const notifications = getMethodsOf<NotificationsSpec>('notifications');
  notifications.pushNotification({
    type: 'success',
    content: 'Renderer connected'
  });
}

function addToSet<T>(set: T[], item: T) {
  return set.indexOf(item) === -1 ? [...set, item] : set;
}
