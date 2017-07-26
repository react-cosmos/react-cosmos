import React from 'react';
import { shallow } from 'enzyme';
import createFetchProxy from '../';

// Vars populated in beforeEach blocks
let FetchProxy;
let NextProxy;
let nextProxyNext;
let nextProxy;
let Component;
let wrapper;

describe('React fetch proxy unmount', () => {
  beforeEach(() => {
    FetchProxy = createFetchProxy();

    // Objects to check identity against
    NextProxy = () => {};
    nextProxyNext = {};
    nextProxy = {
      value: NextProxy,
      next: () => nextProxyNext,
    };
    Component = () => {};

    wrapper = shallow(
      <FetchProxy
        nextProxy={nextProxy}
        component={Component}
        fixture={{
          fetch: {},
        }}
        onComponentRef={() => {}}
        onFixtureUpdate={() => {}}
      />
    );

    wrapper.unmount();
  });

  afterEach(() => {});

  test('TODO', () => {});
});
