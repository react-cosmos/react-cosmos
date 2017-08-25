import React from 'react';
import { shallow } from 'enzyme';
import createXhrProxy from '../';

// Vars populated in beforeEach blocks
let XhrProxy;
let NextProxy;
let nextProxyNext;
let nextProxy;
let Component;
let wrapper;

beforeEach(() => {
  XhrProxy = createXhrProxy();

  // Objects to check identity against
  NextProxy = () => {};
  nextProxyNext = {};
  nextProxy = {
    value: NextProxy,
    next: () => nextProxyNext
  };
  Component = () => {};

  wrapper = shallow(
    <XhrProxy
      nextProxy={nextProxy}
      component={Component}
      fixture={{
        xhr: [
          {
            url: '/users',
            response: () => {} // Never reached in this test
          }
        ]
      }}
      onComponentRef={() => {}}
      onFixtureUpdate={() => {}}
    />
  );

  wrapper.unmount();
});

test('unmounting reverts to original XMLHttpRequest', () => {
  // Name would be `MockXMLHttpRequest` if we didn't properly unmock it
  expect(XMLHttpRequest.name).toBe('XMLHttpRequest');
});
