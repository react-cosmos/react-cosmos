import { RendererCoreContext } from './shared/index.js';
import { postReloadFixtureRequest } from './shared/postRequest.js';

export function reloadFixture(context: RendererCoreContext) {
  const { connectedRendererIds } = context.getState();
  connectedRendererIds.forEach(rendererId =>
    postReloadFixtureRequest(context, rendererId)
  );
}
