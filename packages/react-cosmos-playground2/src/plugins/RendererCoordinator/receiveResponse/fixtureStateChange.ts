import { isEqual } from 'lodash';
import { FixtureStateChangeResponse } from 'react-cosmos-shared2/renderer';
import { getUrlParams } from '../shared/router';
import { postSetFixtureStateRequest } from '../shared/postRequest';
import { RendererCoordinatorContext } from '../shared';

export function receiveFixtureStateChangeResponse(
  context: RendererCoordinatorContext,
  { payload }: FixtureStateChangeResponse
) {
  const { rendererId, fixturePath, fixtureState } = payload;
  const urlParams = getUrlParams(context);
  const {
    primaryRendererId,
    fixtureState: prevFixtureState
  } = context.getState();

  if (fixturePath !== urlParams.fixturePath) {
    console.warn(
      '[Renderer] fixtureStateChange response ignored ' +
        `because it doesn't match the selected fixture`
    );
    return;
  }

  // Discard updates from secondary renderers
  if (rendererId !== primaryRendererId) {
    return;
  }

  if (isEqual(fixtureState, prevFixtureState)) {
    console.info(
      '[Renderer] fixtureStateChange response ignored ' +
        'because existing fixture state is identical'
    );
    return;
  }

  context.setState(
    prevState => ({ ...prevState, fixtureState }),
    afterStateChanged
  );

  function afterStateChanged() {
    // Sync secondary renderers with changed primary renderer fixture state
    const { connectedRendererIds } = context.getState();
    connectedRendererIds.forEach(curRendererId => {
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
