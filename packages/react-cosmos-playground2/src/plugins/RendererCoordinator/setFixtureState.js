// @flow

import { updateState } from 'react-cosmos-shared2/util';
import { getUrlParams } from './shared/router';
import { postSetFixtureStateRequest } from './shared/postRequest';

import type { StateUpdater } from 'react-cosmos-shared2/util';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { RendererContext } from './shared';

export function setFixtureState(
  context: RendererContext,
  stateChange: StateUpdater<null | FixtureState>
) {
  const { fixturePath } = getUrlParams(context);

  if (!fixturePath) {
    console.warn(
      '[Renderer] Trying to set fixture state with no fixture selected'
    );
    return;
  }

  context.setState(stateUpdater, afterStateChanged);

  function stateUpdater(prevState) {
    return {
      ...prevState,
      fixtureState: updateState(prevState.fixtureState, stateChange)
    };
  }

  function afterStateChanged() {
    const { connectedRendererIds, fixtureState } = context.getState();
    connectedRendererIds.forEach(rendererId =>
      postSetFixtureStateRequest(context, rendererId, fixturePath, fixtureState)
    );
  }
}
