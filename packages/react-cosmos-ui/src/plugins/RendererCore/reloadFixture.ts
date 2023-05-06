import { RendererCoreContext } from './shared/index.js';
import { postReloadFixtureRequest } from './shared/postRequest.js';
import { getSelectedFixtureId } from './shared/router.js';

export function reloadFixture(context: RendererCoreContext) {
  const fixtureId = getSelectedFixtureId(context);

  if (!fixtureId) {
    console.warn('[Renderer] Trying to reload with no fixture selected');
    return;
  }

  const { connectedRendererIds } = context.getState();
  connectedRendererIds.forEach(rendererId =>
    postReloadFixtureRequest(context, rendererId, fixtureId)
  );
}
