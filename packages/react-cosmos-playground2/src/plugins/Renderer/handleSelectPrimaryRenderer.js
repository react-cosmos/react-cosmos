// @flow

import type { RendererId } from 'react-cosmos-shared2/renderer';
import type { RendererContext } from './shared';

export function handleSelectPrimaryRenderer(
  { setState }: RendererContext,
  primaryRendererId: RendererId
) {
  setState(prevState => ({
    ...prevState,
    primaryRendererId
  }));
}
