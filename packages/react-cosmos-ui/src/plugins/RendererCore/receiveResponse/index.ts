import { MessageType, RendererResponse } from 'react-cosmos-core';
import { RendererCoreContext } from '../shared/index.js';
import { receiveFixtureListItemUpdateResponse } from './fixtureListItemUpdate.js';
import { receiveFixtureListUpdateResponse } from './fixtureListUpdate.js';
import { receiveFixtureStateChangeResponse } from './fixtureStateChange.js';
import { receivePlaygroundCommandResponse } from './playgroundCommand.js';
import { receiveRendererReadyResponse } from './rendererReady.js';

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
    case 'fixtureListItemUpdate':
      return receiveFixtureListItemUpdateResponse(context, rendererResponse);
    case 'fixtureStateChange':
      return receiveFixtureStateChangeResponse(context, rendererResponse);
    case 'playgroundCommand':
      return receivePlaygroundCommandResponse(context, rendererResponse);
    default:
    // No need to handle every message. Maybe some plugin cares about it.
  }
}
