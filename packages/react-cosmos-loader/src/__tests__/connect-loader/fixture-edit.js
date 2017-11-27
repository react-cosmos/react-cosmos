// @flow

import afterPendingTimers from 'after-pending-timers';
import until from 'async-until';
import { createContext } from '../../create-context';
import { connectLoader } from '../../connect-loader';
import {
  getMock,
  renderer,
  proxies,
  fixtures,
  fixtureFoo,
  subscribeToWindowMessages,
  hasReceivedReadyMessage,
  postWindowMessage
} from './_shared';

const mockMount = jest.fn();

jest.mock('../../create-context', () => ({
  createContext: jest.fn(() => ({ mount: mockMount }))
}));

subscribeToWindowMessages();

beforeEach(async () => {
  jest.clearAllMocks();

  connectLoader({
    renderer,
    proxies,
    fixtures
  });

  await until(hasReceivedReadyMessage);

  postWindowMessage({
    type: 'fixtureSelect',
    component: 'Foo',
    fixture: 'foo'
  });

  postWindowMessage({
    type: 'fixtureEdit',
    fixtureBody: {
      foo: false
    }
  });

  // postMessage events are only received in the next loop
  await afterPendingTimers();
});

it('creates new context with merged fixture', () => {
  expect(getMock(createContext).calls[1][0]).toMatchObject({
    renderer,
    proxies,
    fixture: {
      // Note that the serializable part of fixtureFoo is preserved, on top
      // of which the serializable fixture part is applied
      fooFn: fixtureFoo.fooFn,
      foo: false
    }
  });
});

it('mounts context again', () => {
  expect(mockMount).toHaveBeenCalledTimes(2);
});
