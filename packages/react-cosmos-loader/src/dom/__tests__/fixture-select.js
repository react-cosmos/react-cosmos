// @flow

import { getMock } from 'react-cosmos-flow/jest';
import { createContext } from '../../create-context';
import { mount } from '../mount';
import {
  proxies,
  fixtures,
  fixtureFoo,
  subscribeToWindowMessages,
  getLastWindowMessage,
  untilEvent,
  postWindowMessage
} from './_shared';

const mockMount = jest.fn();

jest.mock('../../create-context', () => ({
  createContext: jest.fn(() => ({ mount: mockMount }))
}));

subscribeToWindowMessages();

const mockDismissRuntimeErrors = jest.fn();

let destroy;

beforeEach(async () => {
  jest.clearAllMocks();

  destroy = await mount({
    proxies,
    fixtures,
    dismissRuntimeErrors: mockDismissRuntimeErrors
  });

  await untilEvent('loaderReady');

  postWindowMessage({
    type: 'fixtureSelect',
    component: 'Foo',
    fixture: 'foo'
  });

  await untilEvent('fixtureSelect');
});

// Ensure state doesn't leak between tests
afterEach(() => destroy());

it('creates context with fixture "Foo/foo"', () => {
  const [[params]] = getMock(createContext).calls;

  expect(params.renderer).toEqual(expect.any(Function));
  expect(params.proxies).toContain(...proxies);
  expect(params.fixture).toBe(fixtureFoo);
});

it('mounts context', () => {
  expect(mockMount).toHaveBeenCalled();
});

it('sends fixtureLoad event to parent with serializable fixture body', async () => {
  await untilEvent('fixtureLoad');

  expect(getLastWindowMessage()).toEqual({
    type: 'fixtureLoad',
    // Note: fixture.fooFn is unserializable so it's omitted
    fixtureBody: {
      foo: true
    }
  });
});

test('calls dismissRuntimeErrors', () => {
  expect(mockDismissRuntimeErrors).toHaveBeenCalled();
});
