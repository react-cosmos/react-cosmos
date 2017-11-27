// @flow

import afterPendingTimers from 'after-pending-timers';
import { connectLoader } from '../../connect-loader';
import {
  renderer,
  proxies,
  fixtures,
  subscribeToWindowMessages,
  getLastWindowMessage
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

  // postMessage events are only received in the next loop
  await afterPendingTimers();
});

afterEach(() => destroy());

it('notifies parent frame with updated fixture names', () => {
  expect(getLastWindowMessage()).toEqual({
    type: 'loaderReady',
    fixtures: {
      Foo: ['foo'],
      Bar: ['bar']
    }
  });
});
