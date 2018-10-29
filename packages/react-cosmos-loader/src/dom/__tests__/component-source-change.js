// @flow

import { getMock } from 'react-cosmos-flow/jest';
import { createContext } from '../../create-context';
import { mount } from '../mount';
import {
  proxies,
  fixtures,
  fixtureFoo,
  subscribeToWindowMessages,
  untilEvent,
  untilEventSeq,
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

const componentNew = () => null;
const componentNew2 = () => null;
const componentNew3 = () => null;
let destroy;

beforeEach(async () => {
  jest.clearAllMocks();

  destroy = await mount({
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

  destroy = await mount({
    proxies,
    fixtures: {
      ...fixtures,
      Foo: {
        foo: {
          ...fixtureFoo,
          component: componentNew
        }
      }
    }
  });

  await untilEventSeq(['fixtureListUpdate', 'fixtureLoad']);
});

// Ensure state doesn't leak between tests
afterEach(() => destroy());

it('creates context with new component', () => {
  expect(getMock(createContext).calls[1][0].fixture).toEqual({
    ...fixtureFoo,
    component: componentNew
  });
});

it('uses new component on re-select', async () => {
  postWindowMessage({
    type: 'fixtureSelect',
    component: 'Foo',
    fixture: 'foo'
  });

  await untilEvent('fixtureSelect');
  await untilEvent('fixtureLoad');

  expect(getMock(createContext).calls[2][0].fixture).toEqual({
    ...fixtureFoo,
    component: componentNew
  });
});

describe('after fixture update', () => {
  beforeEach(async () => {
    onContextUpdate({ update: true });

    await untilEvent('fixtureUpdate');

    destroy = await mount({
      proxies,
      fixtures: {
        ...fixtures,
        Foo: {
          foo: {
            ...fixtureFoo,
            component: componentNew2
          }
        }
      }
    });

    await untilEventSeq(['fixtureListUpdate', 'fixtureLoad']);
  });

  it('creates context with new component and updated field', () => {
    expect(getMock(createContext).calls[2][0].fixture).toEqual({
      ...fixtureFoo,
      component: componentNew2,
      update: true
    });
  });
});

describe('after fixture edit', () => {
  beforeEach(async () => {
    postWindowMessage({
      type: 'fixtureEdit',
      fixtureBody: {
        edit: true
      }
    });

    await untilEvent('fixtureEdit');

    destroy = await mount({
      proxies,
      fixtures: {
        ...fixtures,
        Foo: {
          foo: {
            ...fixtureFoo,
            component: componentNew3
          }
        }
      }
    });

    await untilEventSeq(['fixtureListUpdate', 'fixtureLoad']);
  });

  it('creates context with new component and edited body', () => {
    expect(getMock(createContext).calls[3][0].fixture).toEqual({
      // Note: Only unserializable fixture fields were kept
      fooFn: fixtureFoo.fooFn,
      component: componentNew3,
      edit: true
    });
  });
});
