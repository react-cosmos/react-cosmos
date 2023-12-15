import {
  FixtureId,
  HybridStateChange,
  applyFixtureStateChange,
} from 'react-cosmos-core';
import { RendererCoreContext, State } from './shared/index.js';
import { postSetFixtureStateRequest } from './shared/postRequest.js';
import { getSelectedFixtureId } from './shared/router.js';

export function setFixtureState(
  context: RendererCoreContext,
  name: string,
  change: HybridStateChange<unknown>
) {
  const fixtureId = getSelectedFixtureId(context);

  if (!fixtureId) {
    console.warn(
      '[Renderer] Trying to set fixture state with no fixture selected'
    );
    return;
  }

  context.setState(stateUpdater, () => {
    postRendererRequest(fixtureId);
  });

  function stateUpdater(prevState: State) {
    return {
      ...prevState,
      fixtureState: applyFixtureStateChange(
        prevState.fixtureState,
        name,
        change
      ),
    };
  }

  function postRendererRequest(selectedFixtureId: FixtureId) {
    const { connectedRendererIds, fixtureState } = context.getState();
    connectedRendererIds.forEach(rendererId =>
      postSetFixtureStateRequest(
        context,
        rendererId,
        selectedFixtureId,
        fixtureState
      )
    );
  }
}
