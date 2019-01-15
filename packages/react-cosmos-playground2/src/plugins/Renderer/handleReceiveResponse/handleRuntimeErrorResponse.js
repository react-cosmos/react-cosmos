// @flow

import { setRendererItemState } from '../shared';

import type { RuntimeErrorResponse } from 'react-cosmos-shared2/renderer';
import type { RendererContext } from '../shared';

export function handleRuntimeErrorResponse(
  context: RendererContext,
  { payload }: RuntimeErrorResponse
) {
  const { rendererId } = payload;

  setRendererItemState(context, rendererId, rendererItemState => ({
    ...rendererItemState,
    runtimeError: true
  }));
}
