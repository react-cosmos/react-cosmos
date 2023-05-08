import { RendererId, RendererReadyResponse } from 'react-cosmos-core';
import { NotificationsSpec } from '../../Notifications/spec.js';
import { RouterSpec } from '../../Router/spec.js';
import { RendererCoreContext, State } from '../shared/index.js';
import { postSelectFixtureRequest } from '../shared/postRequest.js';

export function receiveRendererReadyResponse(
  context: RendererCoreContext,
  { payload }: RendererReadyResponse
) {
  const { rendererId } = payload;
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
    const router = context.getMethodsOf<RouterSpec>('router');
    const { primaryRendererId } = context.getState();

    const rendererFixtureId = payload.selectedFixtureId;
    const routerFixtureId = router.getSelectedFixtureId();

    // This looks a bit hairy but here's the idea:
    // - If a renderer connects with a fixture selected, go to that fixture
    //   in the Cosmos UI if a) no fixture is already selected and b) the
    //   connected renderer is the primary one.
    // - If a renderer connects without a fixture selected and a fixture is
    //   selected in the Cosmos UI, sent a request to load the selected fixture
    //   in the connected renderer.
    if (rendererFixtureId) {
      if (!routerFixtureId && rendererId === primaryRendererId) {
        router.selectFixture(rendererFixtureId);
      }
    } else if (routerFixtureId) {
      const { fixtureState } = context.getState();
      postSelectFixtureRequest(
        context,
        rendererId,
        routerFixtureId,
        fixtureState
      );
    }

    // Notify about connected renderers that weren't connected before
    if (!prevRendererIds.includes(rendererId)) {
      notifyRendererConnection(context, rendererId);
    }
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
