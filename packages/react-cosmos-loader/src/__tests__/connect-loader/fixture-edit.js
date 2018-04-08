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
      edit: true
    }
  });

  await untilEvent('fixtureEdit');
});

// Ensure state doesn't leak between tests
afterEach(() => destroy());

it('creates context with merged fixture', () => {
  expect(getMock(createContext).calls[1][0].fixture).toEqual({
    // Note that the serializable part of fixtureFoo is preserved, on top
    // of which the serializable fixture part is applied
    component: fixtureFoo.component,
    fooFn: fixtureFoo.fooFn,
    edit: true
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
            change: true
          }
        }
      }
    });
  });

  it('ignores change and creates context with edited fixture fields', async () => {
    expect(getMock(createContext).calls[2][0].fixture).toEqual({
      component: fixtureFoo.component,
      fooFn: fixtureFoo.fooFn,
      edit: true
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

    it('creates new context with latest fixture source', () => {
      expect(getMock(createContext).calls[3][0].fixture).toEqual({
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

      it('creates a new context', async () => {
        expect(getMock(createContext).calls[4][0].fixture).toEqual({
          ...fixtureFoo,
          change2: true
        });
      });
    });
  });
});
