// @flow

import { handleRendererReadyResponse } from './handleRendererReadyResponse';
import { handleFixtureListUpdateResponse } from './handleFixtureListUpdateResponse';
import { handleFixtureStateChangeResponse } from './handleFixtureStateChangeResponse';
import { handleRuntimeErrorResponse } from './handleRuntimeErrorResponse';

import type { RendererResponse } from 'react-cosmos-shared2/renderer';
import type { RendererContext } from '../shared';

export function handleReceiveResponse(
  context: RendererContext,
  msg: RendererResponse
) {
  switch (msg.type) {
    case 'rendererReady':
      return handleRendererReadyResponse(context, msg);
    case 'fixtureListUpdate':
      return handleFixtureListUpdateResponse(context, msg);
    case 'fixtureStateChange':
      return handleFixtureStateChangeResponse(context, msg);
    case 'runtimeError':
      return handleRuntimeErrorResponse(context, msg);
    default:
    // No need to handle every message. Maybe some plugin cares about it.
  }
}
