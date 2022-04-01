import { FixtureState } from '../../../core/fixtureState/types.js';
import { FixtureId } from '../../../core/types.js';
import { StateUpdater } from '../../../utils/types.js';
import { RendererCoreContext, State } from './shared/index.js';
import { postSetFixtureStateRequest } from './shared/postRequest.js';
import { getSelectedFixtureId } from './shared/router.js';

export function setFixtureState(
  context: RendererCoreContext,
  stateUpdater: StateUpdater<FixtureState>
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
      fixtureState: stateUpdater(prevState.fixtureState),
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
