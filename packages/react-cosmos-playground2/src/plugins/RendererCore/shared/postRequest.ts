import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import {
  FixtureId,
  RendererId,
  RendererRequest
} from 'react-cosmos-shared2/renderer';
import { Context } from '../shared';

export function postSelectFixtureRequest(
  context: Context,
  rendererId: RendererId,
  fixtureId: FixtureId,
  fixtureState: FixtureState
) {
  postRendererRequest(context, {
    type: 'selectFixture',
    payload: {
      rendererId,
      fixtureId,
      fixtureState
    }
  });
}

export function postUnselectFixtureRequest(
  context: Context,
  rendererId: RendererId
) {
  postRendererRequest(context, {
    type: 'unselectFixture',
    payload: {
      rendererId
    }
  });
}

export function postSetFixtureStateRequest(
  context: Context,
  rendererId: RendererId,
  fixtureId: FixtureId,
  fixtureState: FixtureState
) {
  postRendererRequest(context, {
    type: 'setFixtureState',
    payload: {
      rendererId,
      fixtureId,
      fixtureState
    }
  });
}

function postRendererRequest({ emit }: Context, msg: RendererRequest) {
  emit('request', msg);
}
