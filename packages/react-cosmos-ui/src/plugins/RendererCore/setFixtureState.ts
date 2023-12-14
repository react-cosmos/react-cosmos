import { FixtureId, StateUpdater } from 'react-cosmos-core';
import { RendererCoreContext, State } from './shared/index.js';
import { postSetFixtureStateRequest } from './shared/postRequest.js';
import { getSelectedFixtureId } from './shared/router.js';

export function setFixtureState(
  context: RendererCoreContext,
  name: string,
  update: StateUpdater<unknown>
) {
  const fixtureId = getSelectedFixtureId(context);

  if (!fixtureId) {
    console.warn(
      '[Renderer] Trying to set fixture state with no fixture selected'
    );
    return;
  }

  context.setState(change, () => {
    postRendererRequest(fixtureId);
  });

  function change(prevState: State) {
    return {
      ...prevState,
      fixtureState: {
        ...prevState.fixtureState,
        [name]: update(prevState.fixtureState[name]),
      },
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
