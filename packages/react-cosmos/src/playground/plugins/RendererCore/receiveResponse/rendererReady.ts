import { FixtureId } from 'react-cosmos-core/fixture';
import { RendererId, RendererReadyResponse } from 'react-cosmos-core/renderer';
import { NotificationsSpec } from '../../Notifications/spec';
import { RouterSpec } from '../../Router/spec';
import { RendererCoreContext, State } from '../shared';
import { postSelectFixtureRequest } from '../shared/postRequest';
import { getSelectedFixtureId } from '../shared/router';

export function receiveRendererReadyResponse(
  context: RendererCoreContext,
  { payload }: RendererReadyResponse
) {
  const { rendererId, fixtures, initialFixtureId } = payload;
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
      fixtureState: isPrimaryRenderer ? {} : fixtureState,
    };
  }

  function afterStateChanged() {
    if (initialFixtureId) selectInitialFixture(context, initialFixtureId);
    else selectFixtureFromUrlParams(context, rendererId);
    notifyRendererConnection(context, rendererId);
  }
}

function selectInitialFixture(
  { getMethodsOf }: RendererCoreContext,
  fixtureId: FixtureId
) {
  const router = getMethodsOf<RouterSpec>('router');
  router.selectFixture(fixtureId);
}

function selectFixtureFromUrlParams(
  context: RendererCoreContext,
  rendererId: RendererId
) {
  const fixtureId = getSelectedFixtureId(context);
  if (fixtureId) {
    const { fixtureState } = context.getState();
    postSelectFixtureRequest(context, rendererId, fixtureId, fixtureState);
  }
}

function notifyRendererConnection(
  { getMethodsOf }: RendererCoreContext,
  rendererId: RendererId
) {
  const notifications = getMethodsOf<NotificationsSpec>('notifications');
  notifications.pushTimedNotification({
    id: `renderer-connect-${rendererId}`,
    type: 'info',
    title: 'Renderer connected',
    info: 'Your fixtures are ready to use.',
  });
}

function addToSet<T>(set: T[], item: T) {
  return set.indexOf(item) === -1 ? [...set, item] : set;
}
