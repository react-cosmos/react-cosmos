import {
  FixtureId,
  RendererId,
  RendererReadyResponse,
} from 'react-cosmos-core';
import { NotificationsSpec } from '../../Notifications/spec.js';
import { RouterSpec } from '../../Router/spec.js';
import { RendererCoreContext, State } from '../shared/index.js';
import { postSelectFixtureRequest } from '../shared/postRequest.js';
import { getSelectedFixtureId } from '../shared/router.js';

export function receiveRendererReadyResponse(
  context: RendererCoreContext,
  { payload }: RendererReadyResponse
) {
  const { rendererId, selectedFixtureId } = payload;
  const { connectedRendererIds: prevRendererIds } = context.getState();

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
      fixtureState: isPrimaryRenderer ? {} : fixtureState,
    };
  }

  function afterStateChanged() {
    if (selectedFixtureId) selectInitialFixture(context, selectedFixtureId);
    else selectFixtureFromUrlParams(context, rendererId);

    // Don't notify about already connected renderers that just reloaded
    if (!prevRendererIds.includes(rendererId)) {
      notifyRendererConnection(context, rendererId);
    }
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
