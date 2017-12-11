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
  getLastWindowMessage,
  untilEvent,
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

  onContextUpdate({ foo: false, fooFn: () => {} });

  await untilEvent('fixtureUpdate');
});

// Ensure state doesn't leak between tests
afterEach(() => destroy());

it('sends serializable part of updated fixture body to parent', async () => {
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

describe('after fixture change', () => {
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
    // The previous context (with the updated fixture) should be preserved
    expect(createContext).toHaveBeenCalledTimes(1);
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
      expect(getMock(createContext).calls[1][0]).toMatchObject({
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

      expect(getMock(createContext).calls[2][0]).toMatchObject({
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
