// @flow

import afterPendingTimers from 'after-pending-timers';
import { until, getMock } from 'react-cosmos-shared/src/jest';
import { createContext } from '../../create-context';
import { connectLoader } from '../../connect-loader';
import {
  renderer,
  proxies,
  fixtures,
  fixtureFoo,
  subscribeToWindowMessages,
  receivedEvent,
  postWindowMessage
} from './_shared';

const mockMount = jest.fn();

jest.mock('../../create-context', () => ({
  createContext: jest.fn(() => ({ mount: mockMount }))
}));

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

// Ensure state doesn't leak between tests
afterEach(() => destroy());

it('mounts context again', () => {
  expect(mockMount).toHaveBeenCalledTimes(2);
});
