// @flow

import afterPendingTimers from 'after-pending-timers';
import { createContext } from '../../create-context';
import { connectLoader } from '../../connect-loader';
import {
  getMock,
  renderer,
  proxies,
  fixtures,
  fixtureFoo,
  subscribeToWindowMessages,
  getLastWindowMessage,
  receivedEvent,
  postWindowMessage,
  until
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

  // postMessage events are only received in the next loop
  await afterPendingTimers();
});

// Ensure state doesn't leak between tests
afterEach(() => destroy());

it('creates context with fixture "Foo/foo"', () => {
  expect(getMock(createContext).calls[0][0]).toMatchObject({
    renderer,
    proxies,
    fixture: fixtureFoo
  });
});

it('mounts context', () => {
  expect(mockMount).toHaveBeenCalled();
});

it('sends fixtureLoad event to parent with serializable fixture body', async () => {
  // postMessage events are only received in the next loop
  await afterPendingTimers();

  expect(getLastWindowMessage()).toEqual({
    type: 'fixtureLoad',
    // Note: fixture.fooFn is unserializable so it's omitted
    fixtureBody: {
      foo: true
    }
  });
});
