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

const updateFn = () => {};
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

  onContextUpdate({ update: true, updateFn });

  await untilEvent('fixtureUpdate');
});

// Ensure state doesn't leak between tests
afterEach(() => destroy());

it('sends serializable part of updated fixture body to parent', async () => {
  expect(getLastWindowMessage()).toEqual({
    type: 'fixtureUpdate',
    // Note: fixture.updateFn is unserializable so it's omitted
    fixtureBody: {
      update: true
    }
  });
});

it('does not mount context again', () => {
  expect(mockMount).toHaveBeenCalledTimes(1);
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
            change: true
          }
        }
      }
    });
  });

  it('ignores change and creates context with cached fixture fields', async () => {
    expect(getMock(createContext).calls[1][0].fixture).toEqual({
      ...fixtureFoo,
      update: true,
      updateFn
    });
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

    it('discards update and creates context with latest fixture source', () => {
      expect(getMock(createContext).calls[2][0].fixture).toEqual({
        ...fixtureFoo,
        change: true
      });
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
                change2: true
              }
            }
          }
        });
      });

      it('creates context with latest fixture source', async () => {
        expect(getMock(createContext).calls[3][0].fixture).toEqual({
          ...fixtureFoo,
          change2: true
        });
      });
    });
  });
});
