// @flow

import { mapValues } from 'lodash';
import { DEFAULT_RENDERER_STATE, getPrimaryRendererState } from '../shared';
import { selectFixtureFromUrlParams } from './shared';

import type { RendererReadyResponse } from 'react-cosmos-shared2/renderer';
import type { RendererContext } from '../shared';

export function handleRendererReadyResponse(
  context: RendererContext,
  { payload }: RendererReadyResponse
) {
  const { rendererId, fixtures } = payload;

  const updater = prevState => {
    // The first announced renderer becomes the primary one
    const primaryRendererId = prevState.primaryRendererId || rendererId;
    const isPrimaryRenderer = rendererId === primaryRendererId;

    // Reset fixture state of all renderers when primary renderer resets
    const prevRenderers = isPrimaryRenderer
      ? mapValues(prevState.renderers, rendererItemState => ({
          ...rendererItemState,
          fixtureState: null
        }))
      : prevState.renderers;

    return {
      ...prevState,
      primaryRendererId,
      renderers: {
        ...prevRenderers,
        [rendererId]: {
          ...DEFAULT_RENDERER_STATE,
          fixtures,
          fixtureState: isPrimaryRenderer
            ? null
            : getPrimaryRendererFixtureState(prevState)
        }
      }
    };
  };

  context.setState(updater, () =>
    selectFixtureFromUrlParams(context, rendererId)
  );
}

function getPrimaryRendererFixtureState(state) {
  const primaryRendererState = getPrimaryRendererState(state);

  return primaryRendererState ? primaryRendererState.fixtureState : null;
}
