import { StateUpdater, updateState } from 'react-cosmos-shared2/util';
import { getUrlParams } from './shared/router';
import { postSetFixtureStateRequest } from './shared/postRequest';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { RendererCoordinatorContext, RendererCoordinatorState } from './shared';

export function setFixtureState(
  context: RendererCoordinatorContext,
  stateChange: StateUpdater<null | FixtureState>
) {
  const { fixturePath } = getUrlParams(context);

  if (!fixturePath) {
    console.warn(
      '[Renderer] Trying to set fixture state with no fixture selected'
    );
    return;
  }

  context.setState(stateUpdater, () => {
    postRendererRequest(fixturePath);
  });

  function stateUpdater(prevState: RendererCoordinatorState) {
    return {
      ...prevState,
      fixtureState: updateState(prevState.fixtureState, stateChange)
    };
  }

  function postRendererRequest(selectedFixturePath: string) {
    const { connectedRendererIds, fixtureState } = context.getState();
    connectedRendererIds.forEach(rendererId =>
      postSetFixtureStateRequest(
        context,
        rendererId,
        selectedFixturePath,
        fixtureState
      )
    );
  }
}
