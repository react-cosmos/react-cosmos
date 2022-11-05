import { MessageType, RendererResponse } from 'react-cosmos-core';
import { RendererCoreContext } from '../shared';
import { receiveFixtureListUpdateResponse } from './fixtureListUpdate';
import { receiveFixtureStateChangeResponse } from './fixtureStateChange';
import { receivePlaygroundCommandResponse } from './playgroundCommand';
import { receiveRendererReadyResponse } from './rendererReady';

export function receiveResponse(
  context: RendererCoreContext,
  msg: MessageType
) {
  context.emit('response', msg);

  const rendererResponse = msg as RendererResponse;
  switch (rendererResponse.type) {
    case 'rendererReady':
      return receiveRendererReadyResponse(context, rendererResponse);
    case 'fixtureListUpdate':
      return receiveFixtureListUpdateResponse(context, rendererResponse);
    case 'fixtureStateChange':
      return receiveFixtureStateChangeResponse(context, rendererResponse);
    case 'playgroundCommand':
      return receivePlaygroundCommandResponse(context, rendererResponse);
    default:
    // No need to handle every message. Maybe some plugin cares about it.
  }
}
