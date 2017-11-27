// @flow

import afterPendingTimers from 'after-pending-timers';
import until from 'async-until';
import { connectLoader } from '../../connect-loader';
import {
  renderer,
  proxies,
  fixtures,
  subscribeToWindowMessages,
  getLastWindowMessage,
  hasReceivedReadyMessage,
  hasSentFixtureLoadMessage,
  postWindowMessage
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

  await until(hasSentFixtureLoadMessage);

  onContextUpdate({ foo: false, fooFn: () => {} });
});

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
