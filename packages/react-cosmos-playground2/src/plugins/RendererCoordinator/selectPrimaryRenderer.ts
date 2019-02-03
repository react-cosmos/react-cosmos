import { RendererId } from 'react-cosmos-shared2/renderer';
import { RendererCoordinatorContext } from './shared';

export function selectPrimaryRenderer(
  { setState }: RendererCoordinatorContext,
  primaryRendererId: RendererId
) {
  setState(prevState => ({ ...prevState, primaryRendererId }));
}
