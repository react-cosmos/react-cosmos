// @flow

import afterPendingTimers from 'after-pending-timers';
import { createContext } from '../../create-context';
import { connectLoader } from '../../connect-loader';
import {
  renderer,
  proxies,
  fixtures,
  subscribeToWindowMessages,
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
    fixture: 'qux'
  });

  // postMessage events are only received in the next loop
  await afterPendingTimers();
});

// Ensure state doesn't leak between tests
afterEach(() => destroy());

it('does not create', () => {
  expect(createContext).not.toHaveBeenCalled();
});
