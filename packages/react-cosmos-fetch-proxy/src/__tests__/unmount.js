import React from 'react';
import fetchMock from 'fetch-mock';
import { shallow } from 'enzyme';
import createFetchProxy from '../';

// Vars populated in beforeEach blocks
let FetchProxy;
let NextProxy;
let nextProxyNext;
let nextProxy;
let Component;
let wrapper;

beforeEach(() => {
  FetchProxy = createFetchProxy();

  // Objects to check identity against
  NextProxy = () => {};
  nextProxyNext = {};
  nextProxy = {
    value: NextProxy,
    next: () => nextProxyNext
  };
  Component = () => {};

  wrapper = shallow(
    <FetchProxy
      nextProxy={nextProxy}
      fixture={{
        component: Component,
        fetch: [
          {
            matcher: '/users',
            response: [{ name: 'John' }, { name: 'Jessica' }]
          }
        ]
      }}
      onComponentRef={() => {}}
      onFixtureUpdate={() => {}}
    />
  );

  wrapper.unmount();
});

test('unmounting reverts to original fetch', () => {
  // The original window.fetch is also a mock from jest.config.js #inceptionmock
  expect(fetch).toBe('__GLOBAL_FETCH_MOCK__');
});

test('clear alls mocks', () => {
  expect(fetchMock.routes).toHaveLength(0);
});
