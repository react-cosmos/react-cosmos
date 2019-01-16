// @flow

import type { RendererErrorResponse } from 'react-cosmos-shared2/renderer';
import type { RendererContext } from '../shared';

const INIT_ERROR_RENDERER_STATE = {
  status: 'initError',
  fixtures: [],
  fixtureState: null
};

export function handleRendererErrorResponse(
  { setState }: RendererContext,
  { payload }: RendererErrorResponse
) {
  const { rendererId } = payload;

  setState(prevState => {
    const { renderers } = prevState;
    const rendererItemState = renderers[rendererId];

    return {
      ...prevState,
      renderers: {
        ...renderers,
        [rendererId]: rendererItemState
          ? { ...rendererItemState, status: 'fixtureError', fixtureState: null }
          : INIT_ERROR_RENDERER_STATE
      }
    };
  });
}
