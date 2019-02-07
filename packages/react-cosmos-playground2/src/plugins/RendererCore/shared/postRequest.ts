import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { RendererId, RendererRequest } from 'react-cosmos-shared2/renderer';
import { Context } from '../shared';

export function postSelectFixtureRequest(
  context: Context,
  rendererId: RendererId,
  fixturePath: string,
  fixtureState: null | FixtureState
) {
  postRendererRequest(context, {
    type: 'selectFixture',
    payload: {
      rendererId,
      fixturePath,
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
  fixturePath: string,
  fixtureState: null | FixtureState
) {
  postRendererRequest(context, {
    type: 'setFixtureState',
    payload: {
      rendererId,
      fixturePath,
      fixtureState
    }
  });
}

function postRendererRequest({ emit }: Context, msg: RendererRequest) {
  emit('request', msg);
}
