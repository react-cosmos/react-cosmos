// @flow

import { DEFAULT_RENDERER_STATE } from '../shared';

import type { RuntimeErrorResponse } from 'react-cosmos-shared2/renderer';
import type { RendererContext } from '../shared';

export function handleRuntimeErrorResponse(
  { setState }: RendererContext,
  { payload }: RuntimeErrorResponse
) {
  const { rendererId } = payload;

  setState(prevState => {
    const { renderers } = prevState;
    // Extend existing renderer state or create it this renderer sent no other
    // response prior to this error
    const prevRendererItemState =
      renderers[rendererId] || DEFAULT_RENDERER_STATE;

    return {
      ...prevState,
      renderers: {
        ...renderers,
        [rendererId]: {
          ...prevRendererItemState,
          status: 'error'
        }
      }
    };
  });
}
