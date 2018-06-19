// @flow

import { mount } from '../mount';
import {
  proxies,
  fixtures,
  subscribeToWindowMessages,
  untilEvent,
  getLastWindowMessage
} from './_shared';

subscribeToWindowMessages();

let destroy;

beforeEach(async () => {
  jest.clearAllMocks();

  destroy = await mount({
    proxies,
    fixtures
  });

  await untilEvent('loaderReady');
});

// Ensure state doesn't leak between tests
afterEach(() => destroy());

it('notifies parent frame with latest fixture names', async () => {
  destroy = await mount({
    proxies,
    fixtures: {
      ...fixtures,
      Baz: {
        baz: { component: () => {} }
      }
    }
  });

  await untilEvent('fixtureListUpdate');

  expect(getLastWindowMessage()).toEqual({
    type: 'fixtureListUpdate',
    fixtures: {
      Foo: ['foo'],
      Bar: ['bar'],
      Baz: ['baz']
    }
  });
});
