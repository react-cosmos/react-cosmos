// @flow

import { updateState } from 'react-cosmos-shared2/util';
import { forEachRenderer, setRendererState } from './shared';
import { getUrlParams } from './shared/router';
import { postSetFixtureStateRequest } from './shared/postRequest';

import type { StateUpdater } from 'react-cosmos-shared2/util';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { RendererContext } from './shared';

export function handleSetFixtureState(
  context: RendererContext,
  stateChange: StateUpdater<null | FixtureState>,
  cb?: () => mixed
) {
  const { fixturePath } = getUrlParams(context);

  if (!fixturePath) {
    console.warn(
      '[Renderer] Trying to set fixture state with no fixture selected'
    );
    return;
  }

  setRendererState(
    context,
    rendererItemState => ({
      ...rendererItemState,
      fixtureState: updateState(rendererItemState.fixtureState, stateChange)
    }),
    () => {
      if (typeof cb === 'function') cb();

      forEachRenderer(context, (rendererId, { fixtureState }) =>
        postSetFixtureStateRequest(
          context,
          rendererId,
          fixturePath,
          fixtureState
        )
      );
    }
  );
}
