// @flow

import { getRendererItemState, setRendererItemState } from '../shared';
import { selectFixtureFromUrlParams } from './shared';

import type { FixtureListUpdateResponse } from 'react-cosmos-shared2/renderer';
import type { RendererContext } from '../shared';

export function handleFixtureListUpdateResponse(
  context: RendererContext,
  { payload }: FixtureListUpdateResponse
) {
  const { rendererId, fixtures } = payload;
  const { runtimeError } = getRendererItemState(context, rendererId);

  setRendererItemState(
    context,
    rendererId,
    rendererItemState => ({
      ...rendererItemState,
      fixtures,
      // We assume any previous error was resolved because we were able to
      // receive the "fixtureListUpdate" response
      runtimeError: false
    }),
    () => {
      // Re-select fixture when transitioning from error => non-error state.
      // Important to keep this condition, otherwise any hot reloading patch
      // will reset fixture state!
      if (runtimeError) {
        selectFixtureFromUrlParams(context, rendererId);
      }
    }
  );
}
