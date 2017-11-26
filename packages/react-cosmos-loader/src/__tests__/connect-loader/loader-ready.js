// @flow

import afterPendingTimers from 'after-pending-timers';
import { connectLoader } from '../../connect-loader';
import {
  renderer,
  proxies,
  fixtures,
  handleMessage,
  subscribeToWindowMessages,
  getLastWindowMessage
} from './_shared';

subscribeToWindowMessages();

beforeEach(() => {
  jest.clearAllMocks();
});

it('notifies tells parent frame with fixture names', async () => {
  connectLoader({
    renderer,
    proxies,
    fixtures
  });
  await afterPendingTimers();

  expect(handleMessage).toHaveBeenCalled();
  expect(getLastWindowMessage()).toEqual({
    type: 'loaderReady',
    fixtures: {
      Foo: ['foo'],
      Bar: ['bar']
    }
  });
});
