// @flow

import { getMock } from 'react-cosmos-flow/jest';
import { createContext } from '../../create-context';
import { connectLoader } from '../../connect-loader';
import {
  renderer,
  proxies,
  fixtures,
  fixtureFoo,
  subscribeToWindowMessages,
  getLastWindowMessage,
  untilEvent,
  untilEventSeq,
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

  destroy = await connectLoader({
    renderer,
    proxies,
    fixtures
  });

  await untilEvent('loaderReady');

  postWindowMessage({
    type: 'fixtureSelect',
    component: 'Foo',
    fixture: 'foo'
  });

  await untilEvent('fixtureSelect');
  await untilEvent('fixtureLoad');

  destroy = await connectLoader({
    renderer,
    proxies,
    fixtures: {
      ...fixtures,
      Foo: {
        foo: {
          ...fixtureFoo,
          bar: true
        }
      }
    }
  });

  await untilEventSeq(['fixtureListUpdate', 'fixtureLoad']);
});

// Ensure state doesn't leak between tests
afterEach(() => destroy());

it('creates context with new fixture', () => {
  expect(getMock(createContext).calls[1][0].fixture).toEqual({
    ...fixtureFoo,
    bar: true
  });
});

it('mounts context again', () => {
  expect(mockMount).toHaveBeenCalledTimes(2);
});

it('sends fixtureLoad event to parent with latest serializable fixture body', async () => {
  expect(getLastWindowMessage()).toEqual({
    type: 'fixtureLoad',
    // Note: fixture.fooFn is unserializable so it's omitted
    fixtureBody: {
      foo: true,
      bar: true
    }
  });
});

it('uses latest fixture source on re-select', async () => {
  postWindowMessage({
    type: 'fixtureSelect',
    component: 'Foo',
    fixture: 'foo'
  });

  await untilEvent('fixtureSelect');
  await untilEvent('fixtureLoad');

  expect(getMock(createContext).calls[2][0].fixture).toEqual({
    ...fixtureFoo,
    bar: true
  });
});
