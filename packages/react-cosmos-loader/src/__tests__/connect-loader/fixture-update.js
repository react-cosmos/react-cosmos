// @flow

import afterPendingTimers from 'after-pending-timers';
import { connectLoader } from '../../connect-loader';
import {
  renderer,
  proxies,
  fixtures,
  subscribeToWindowMessages,
  getLastWindowMessage,
  receivedEvent,
  postWindowMessage,
  until
} from './_shared';

const mockMount = jest.fn();
let onContextUpdate;

jest.mock('../../create-context', () => ({
  createContext: jest.fn(({ onUpdate }) => {
    onContextUpdate = onUpdate;
    return { mount: mockMount };
  })
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

  await until(
    receivedEvent('fixtureLoad'),
    'Loader has not sent fixture load event'
  );

  onContextUpdate({ foo: false, fooFn: () => {} });
});

// Ensure state doesn't leak between tests
afterEach(() => destroy());

it('sends serializable part of updated fixture body to parent', async () => {
  // postMessage events are only received in the next loop
  await afterPendingTimers();

  expect(getLastWindowMessage()).toEqual({
    type: 'fixtureUpdate',
    // Note: fixture.fooFn is unserializable so it's omitted
    fixtureBody: {
      foo: false
    }
  });
});

it('does not mount context again', () => {
  expect(mockMount).toHaveBeenCalledTimes(1);
});
