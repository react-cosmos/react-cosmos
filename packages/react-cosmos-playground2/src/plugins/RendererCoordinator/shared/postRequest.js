// @flow

import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type {
  RendererId,
  RendererRequest
} from 'react-cosmos-shared2/renderer';
import type { RendererContext } from '.';

export function postSelectFixtureRequest(
  context: RendererContext,
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
  context: RendererContext,
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
  context: RendererContext,
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

function postRendererRequest({ emitEvent }, msg: RendererRequest) {
  emitEvent('request', msg);
}
