import { receiveRendererReadyResponse } from './rendererReady';
import { RendererResponse } from 'react-cosmos-shared2/renderer';
import { receiveFixtureListUpdateResponse } from './fixtureListUpdate';
import { receiveFixtureStateChangeResponse } from './fixtureStateChange';
import { Context } from '../shared';

export function receiveResponse(context: Context, msg: RendererResponse) {
  context.emit('response', msg);

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
