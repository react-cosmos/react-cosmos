import { MessageType, RendererResponse } from 'react-cosmos-core';
import { RendererCoreContext } from '../shared/index.js';
import { receiveFixtureChangeResponse } from './fixtureChange.js';
import { receiveFixtureListUpdateResponse } from './fixtureListUpdate.js';
import { receiveFixtureStateChangeResponse } from './fixtureStateChange.js';
import { receivePlaygroundCommandResponse } from './playgroundCommand.js';
import { receivePushStickyNotificationResponse } from './pushStickyNotification.js';
import { receivePushTimedNotificationResponse } from './pushTimedNotification.js';
import { receiveRemoveStickyNotificationResponse } from './removeStickyNotification.js';
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
    case 'fixtureChange':
      return receiveFixtureChangeResponse(context, rendererResponse);
    case 'fixtureStateChange':
      return receiveFixtureStateChangeResponse(context, rendererResponse);
    case 'playgroundCommand':
      return receivePlaygroundCommandResponse(context, rendererResponse);
    case 'pushStickyNotification':
      return receivePushStickyNotificationResponse(context, rendererResponse);
    case 'removeStickyNotification':
      return receiveRemoveStickyNotificationResponse(context, rendererResponse);
    case 'pushTimedNotification':
      return receivePushTimedNotificationResponse(context, rendererResponse);
    default:
    // No need to handle every message. Maybe some plugin cares about it.
  }
}
