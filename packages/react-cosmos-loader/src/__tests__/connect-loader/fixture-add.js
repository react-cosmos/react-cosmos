// @flow

import afterPendingTimers from 'after-pending-timers';
import { connectLoader } from '../../connect-loader';
import {
  renderer,
  proxies,
  fixtures,
  subscribeToWindowMessages,
  receivedEvent,
  getLastWindowMessage,
  until
} from './_shared';

subscribeToWindowMessages();

let destroy;

beforeEach(async () => {
  jest.clearAllMocks();

  destroy = connectLoader({
    renderer,
    proxies,
    fixtures
  });

  await until(receivedEvent('loaderReady'), 'Loader has not sent ready event');
});

// Ensure state doesn't leak between tests
afterEach(() => destroy());

it('notifies parent frame with latest fixture names', async () => {
  connectLoader({
    renderer,
    proxies,
    fixtures: {
      ...fixtures,
      Baz: {
        baz: { component: () => {} }
      }
    }
  });

  // postMessage events are only received in the next loop
  await afterPendingTimers();

  expect(getLastWindowMessage()).toEqual({
    type: 'fixtureListUpdate',
    fixtures: {
      Foo: ['foo'],
      Bar: ['bar'],
      Baz: ['baz']
    }
  });
});
