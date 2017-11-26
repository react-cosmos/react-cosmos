// @flow

import afterPendingTimers from 'after-pending-timers';
import until from 'async-until';
import { createContext } from '../../create-context';
import { connectLoader } from '../../connect-loader';
import {
  renderer,
  proxies,
  fixtures,
  fixtureFoo,
  subscribeToWindowMessages,
  getLastWindowMessage,
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

  await afterPendingTimers();
});

it('creates context with fixture "Foo/foo"', () => {
  expect(createContext).toHaveBeenCalledWith({
    renderer,
    proxies,
    fixture: fixtureFoo
  });
});

it('mounts context', () => {
  expect(mockMount).toHaveBeenCalled();
});

it('sends fixtureLoad event to parent with fixture body', async () => {
  await afterPendingTimers();
  expect(getLastWindowMessage()).toEqual({
    type: 'fixtureLoad',
    fixtureBody: {
      foo: true
    }
  });
});
