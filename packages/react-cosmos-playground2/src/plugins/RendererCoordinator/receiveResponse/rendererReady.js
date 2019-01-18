// @flow

import { getUrlParams } from '../shared/router';
import { postSelectFixtureRequest } from '../shared/postRequest';

import type { RendererReadyResponse } from 'react-cosmos-shared2/renderer';
import type { RendererContext } from '../shared';

export function receiveRendererReadyResponse(
  context: RendererContext,
  { payload }: RendererReadyResponse
) {
  const { rendererId, fixtures } = payload;

  context.setState(stateUpdater, afterStateChanged);

  function stateUpdater(prevState) {
    // The first announced renderer becomes the primary one
    const primaryRendererId = prevState.primaryRendererId || rendererId;
    const isPrimaryRenderer = rendererId === primaryRendererId;
    const { connectedRendererIds, fixtureState } = prevState;

    return {
      ...prevState,
      connectedRendererIds: addToSet(connectedRendererIds, rendererId),
      primaryRendererId,
      fixtures,
      fixtureState: isPrimaryRenderer ? null : fixtureState
    };
  }

  function afterStateChanged() {
    selectFixtureFromUrlParams(context, rendererId);
  }
}

function selectFixtureFromUrlParams(context, rendererId) {
  const { fixturePath } = getUrlParams(context);

  if (fixturePath) {
    const { fixtureState } = context.getState();
    postSelectFixtureRequest(context, rendererId, fixturePath, fixtureState);
  }
}

function addToSet(set, item) {
  return set.indexOf(item) === -1 ? [...set, item] : set;
}
