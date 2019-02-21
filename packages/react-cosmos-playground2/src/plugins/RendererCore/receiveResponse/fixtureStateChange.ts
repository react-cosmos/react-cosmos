import { isEqual } from 'lodash';
import { FixtureStateChangeResponse } from 'react-cosmos-shared2/renderer';
import { getSelectedFixtureId } from '../shared/router';
import { postSetFixtureStateRequest } from '../shared/postRequest';
import { Context } from '../shared';

export function receiveFixtureStateChangeResponse(
  context: Context,
  { payload }: FixtureStateChangeResponse
) {
  const { rendererId, fixtureId, fixtureState } = payload;
  const selectedFixtureId = getSelectedFixtureId(context);
  const {
    primaryRendererId,
    fixtureState: prevFixtureState
  } = context.getState();

  if (!isEqual(fixtureId, selectedFixtureId)) {
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
          fixtureId,
          fixtureState
        );
      }
    });
  }
}
