import { FixtureId } from '../../../renderer/types';
import { FixtureState } from '../../../utils/fixtureState/types';
import { StateUpdater } from '../../../utils/state';
import { RendererCoreContext, State } from './shared';
import { postSetFixtureStateRequest } from './shared/postRequest';
import { getSelectedFixtureId } from './shared/router';

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
