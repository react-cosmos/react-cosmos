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

  await untilEvent('fixtureLoad');

  postWindowMessage({
    type: 'fixtureEdit',
    fixtureBody: {
      foo: false
    }
  });

  await untilEvent('fixtureEdit');
});

// Ensure state doesn't leak between tests
afterEach(() => destroy());

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

describe('after fixture source change', () => {
  beforeEach(async () => {
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
  });

  it('should not create a new context', async () => {
    // The previous context (with the edited fixture) should be preserved
    expect(createContext).toHaveBeenCalledTimes(2);
  });

  describe('after fixture select', () => {
    beforeEach(async () => {
      postWindowMessage({
        type: 'fixtureSelect',
        component: 'Foo',
        fixture: 'foo'
      });

      await untilEvent('fixtureSelect');
    });

    it('should create fresh context with latest fixture source', () => {
      expect(getMock(createContext).calls[2][0]).toMatchObject({
        renderer,
        proxies,
        fixture: {
          ...fixtureFoo,
          bar: true
        }
      });
    });

    it('should keep resetting context on fixture change', async () => {
      destroy = await connectLoader({
        renderer,
        proxies,
        fixtures: {
          ...fixtures,
          Foo: {
            foo: {
              ...fixtureFoo,
              bar: false
            }
          }
        }
      });

      expect(getMock(createContext).calls[3][0]).toMatchObject({
        renderer,
        proxies,
        fixture: {
          ...fixtureFoo,
          bar: false
        }
      });
    });
  });
});
