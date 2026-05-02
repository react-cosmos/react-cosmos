import type { FixtureChangeResponse } from 'react-cosmos-core';
import type { RouterSpec } from '../../Router/spec.js';
import type { RendererCoreContext } from '../shared/index.js';

export function receiveFixtureChangeResponse(
  context: RendererCoreContext,
  { payload }: FixtureChangeResponse
) {
  const { rendererId, fixtureId } = payload;
  const { primaryRendererId } = context.getState();

  // Discard updates from secondary renderers
  if (rendererId !== primaryRendererId) return;

  const router = context.getMethodsOf<RouterSpec>('router');
  router.selectFixture(fixtureId);
}
