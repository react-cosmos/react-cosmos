// @flow

import { isEqual } from 'lodash';
import { getRendererState, setRendererState, forEachRenderer } from '../shared';
import { getUrlParams } from '../shared/router';
import { postSetFixtureStateRequest } from '../shared/postRequest';

import type { FixtureStateChangeResponse } from 'react-cosmos-shared2/renderer';
import type { RendererContext } from '../shared';

export function handleFixtureStateChangeResponse(
  context: RendererContext,
  { payload }: FixtureStateChangeResponse
) {
  const { rendererId, fixturePath, fixtureState } = payload;
  const urlParams = getUrlParams(context);
  const rendererItemState = getRendererState(context, rendererId);

  if (isEqual(fixtureState, rendererItemState.fixtureState)) {
    console.info(
      '[Renderer] fixtureStateChange response ignored ' +
        'because existing fixture state is identical'
    );
    return;
  }

  if (fixturePath !== urlParams.fixturePath) {
    console.warn(
      '[Renderer] fixtureStateChange response ignored ' +
        `because it doesn't match the selected fixture`
    );
    return;
  }

  const { primaryRendererId } = context.getState();
  const isPrimaryRenderer = rendererId === primaryRendererId;

  setRendererState(
    context,
    (rendererItemState, curRendererId) =>
      curRendererId === rendererId || isPrimaryRenderer
        ? { ...rendererItemState, fixtureState }
        : rendererItemState,
    () => {
      // Sync secondary renderers with changed primary renderer fixture state
      if (isPrimaryRenderer) {
        forEachRenderer(context, curRendererId => {
          if (curRendererId !== rendererId) {
            postSetFixtureStateRequest(
              context,
              curRendererId,
              fixturePath,
              fixtureState
            );
          }
        });
      }
    }
  );
}
