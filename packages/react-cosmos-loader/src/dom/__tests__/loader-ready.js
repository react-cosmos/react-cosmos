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
