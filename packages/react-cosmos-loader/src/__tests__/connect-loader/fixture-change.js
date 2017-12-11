// @flow

import { getMock } from 'react-cosmos-shared/src/jest';
import { createContext } from '../../create-context';
import { connectLoader } from '../../connect-loader';
import {
  renderer,
  proxies,
  fixtures,
  fixtureFoo,
  subscribeToWindowMessages,
  untilEvent,
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

  await connectLoader({
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
});

// Ensure state doesn't leak between tests
afterEach(() => destroy());

it('creates new context with new fixture', () => {
  expect(getMock(createContext).calls[1][0]).toMatchObject({
    renderer,
    proxies,
    fixture: {
      ...fixtureFoo,
      bar: true
    }
  });
});

it('mounts context again', () => {
  expect(mockMount).toHaveBeenCalledTimes(2);
});
