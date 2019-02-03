import { RendererCoordinatorContext } from './shared';

export function isRendererConnected({ getState }: RendererCoordinatorContext) {
  return getState().connectedRendererIds.length > 0;
}
