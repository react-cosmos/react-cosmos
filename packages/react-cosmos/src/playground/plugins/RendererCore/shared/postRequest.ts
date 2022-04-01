import { FixtureState } from '../../../../core/fixtureState/types.js';
import { FixtureId } from '../../../../core/types.js';
import { RendererId, RendererRequest } from '../../../../renderer/types.js';
import { RendererCoreContext } from '../shared/index.js';

export function postSelectFixtureRequest(
  context: RendererCoreContext,
  rendererId: RendererId,
  fixtureId: FixtureId,
  fixtureState: FixtureState
) {
  postRendererRequest(context, {
    type: 'selectFixture',
    payload: {
      rendererId,
      fixtureId,
      fixtureState,
    },
  });
}

export function postUnselectFixtureRequest(
  context: RendererCoreContext,
  rendererId: RendererId
) {
  postRendererRequest(context, {
    type: 'unselectFixture',
    payload: {
      rendererId,
    },
  });
}

export function postSetFixtureStateRequest(
  context: RendererCoreContext,
  rendererId: RendererId,
  fixtureId: FixtureId,
  fixtureState: FixtureState
) {
  postRendererRequest(context, {
    type: 'setFixtureState',
    payload: {
      rendererId,
      fixtureId,
      fixtureState,
    },
  });
}

function postRendererRequest(
  { emit }: RendererCoreContext,
  msg: RendererRequest
) {
  emit('request', msg);
}
