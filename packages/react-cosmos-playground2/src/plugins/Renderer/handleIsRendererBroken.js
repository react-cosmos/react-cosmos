// @flow

import { getRendererItemState } from './shared';

import type { RendererId } from 'react-cosmos-shared2/renderer';
import type { RendererContext } from './shared';

export function handleIsRendererBroken(
  context: RendererContext,
  rendererId: RendererId
) {
  const { status } = getRendererItemState(context, rendererId);

  return status === 'error';
}
