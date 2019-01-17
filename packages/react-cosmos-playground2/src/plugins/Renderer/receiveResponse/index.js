// @flow

import { receiveRendererReadyResponse } from './rendererReady';
import { receiveFixtureListUpdateResponse } from './fixtureListUpdate';
import { receiveFixtureStateChangeResponse } from './fixtureStateChange';

import type { RendererResponse } from 'react-cosmos-shared2/renderer';
import type { RendererContext } from '../shared';

export function receiveResponse(
  context: RendererContext,
  msg: RendererResponse
) {
  switch (msg.type) {
    case 'rendererReady':
      return receiveRendererReadyResponse(context, msg);
    case 'fixtureListUpdate':
      return receiveFixtureListUpdateResponse(context, msg);
    case 'fixtureStateChange':
      return receiveFixtureStateChangeResponse(context, msg);
    default:
    // No need to handle every message. Maybe some plugin cares about it.
  }
}
