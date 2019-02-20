import { StateUpdater, updateState } from 'react-cosmos-shared2/util';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { getSelectedFixtureId } from './shared/router';
import { postSetFixtureStateRequest } from './shared/postRequest';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { Context, State } from './shared';

export function setFixtureState(
  context: Context,
  stateChange: StateUpdater<null | FixtureState>
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
      fixtureState: updateState(prevState.fixtureState, stateChange)
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
