import { receiveRendererReadyResponse } from './rendererReady';
import { Message } from 'react-cosmos-shared2/util';
import { RendererResponse } from 'react-cosmos-shared2/renderer';
import { receiveFixtureListUpdateResponse } from './fixtureListUpdate';
import { receiveFixtureStateChangeResponse } from './fixtureStateChange';
import { Context } from '../shared';

export function receiveResponse(context: Context, msg: Message) {
  context.emit('response', msg);

  const rendererResponse = msg as RendererResponse;
  switch (rendererResponse.type) {
    case 'rendererReady':
      return receiveRendererReadyResponse(context, rendererResponse);
    case 'fixtureListUpdate':
      return receiveFixtureListUpdateResponse(context, rendererResponse);
    case 'fixtureStateChange':
      return receiveFixtureStateChangeResponse(context, rendererResponse);
    default:
    // No need to handle every message. Maybe some plugin cares about it.
  }
}
