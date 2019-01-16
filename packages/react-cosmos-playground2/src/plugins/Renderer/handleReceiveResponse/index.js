// @flow

import { handleRendererReadyResponse } from './handleRendererReadyResponse';
import { handleRendererErrorResponse } from './handleRendererErrorResponse';
import { handleFixtureListUpdateResponse } from './handleFixtureListUpdateResponse';
import { handleFixtureStateChangeResponse } from './handleFixtureStateChangeResponse';

import type { RendererResponse } from 'react-cosmos-shared2/renderer';
import type { RendererContext } from '../shared';

export function handleReceiveResponse(
  context: RendererContext,
  msg: RendererResponse
) {
  switch (msg.type) {
    case 'rendererReady':
      return handleRendererReadyResponse(context, msg);
    case 'rendererError':
      return handleRendererErrorResponse(context, msg);
    case 'fixtureListUpdate':
      return handleFixtureListUpdateResponse(context, msg);
    case 'fixtureStateChange':
      return handleFixtureStateChangeResponse(context, msg);
    default:
    // No need to handle every message. Maybe some plugin cares about it.
  }
}
