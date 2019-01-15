// @flow

import {
  DEFAULT_RENDERER_STATE,
  forEachRenderer,
  setRendererState
} from './shared';
import {
  postSelectFixtureRequest,
  postUnselectFixtureRequest
} from './shared/postRequest';

import type { RendererContext } from './shared';

export function handleRouterFixtureChange(
  context: RendererContext,
  fixturePath: void | string
) {
  if (fixturePath === undefined) {
    return resetRendererState(context, () => {
      forEachRenderer(context, rendererId =>
        postUnselectFixtureRequest(context, rendererId)
      );
    });
  }

  // NOTE: The fixture state used to be reset in the local renderer state
  // before posting the "selectFixture" request, but that no longer happens.
  // Resetting renderer state when selecting a fixture makes sense in
  // abstract, but it creates an unnecessary flash of layout whenever
  // reselecting the current fixture, or when selecting a fixture of the same
  // component. By keeping the fixture state until the new fixture state is
  // received from the renderer the transition between fixtures is smoother.
  const selFixturePath = fixturePath;
  forEachRenderer(context, rendererId =>
    postSelectFixtureRequest(context, rendererId, selFixturePath, null)
  );
}

function resetRendererState(context: RendererContext, cb?: () => mixed) {
  setRendererState(
    context,
    rendererItemState => ({
      ...rendererItemState,
      ...DEFAULT_RENDERER_STATE
    }),
    cb
  );
}
