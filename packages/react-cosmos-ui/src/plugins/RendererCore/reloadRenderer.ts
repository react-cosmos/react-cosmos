import { RendererCoreContext } from './shared/index.js';
import { postReloadRendererRequest } from './shared/postRequest.js';

export function reloadRenderer(context: RendererCoreContext) {
  const { connectedRendererIds } = context.getState();
  connectedRendererIds.forEach(rendererId =>
    postReloadRendererRequest(context, rendererId)
  );
}
