import React from 'react';
import { mount } from 'enzyme';
import Loader from '../../Loader';

// Objects to check identity against
const ProxyFoo = () => <span />;
const ProxyBar = () => <span />;
const ComponentFoo = () => {};
const fixtureFoo = {};

// Vars populated in beforeEach blocks
let wrapper;

describe('Proxy is changed', () => {
  beforeEach(() => {
    wrapper = mount(
      <Loader
        proxies={[ProxyFoo]}
        components={{
          Foo: ComponentFoo,
        }}
        fixtures={{
          Foo: {
            foo: fixtureFoo,
          }
        }}
        component="Foo"
        fixture="foo"
      />,
    );

    wrapper.setProps({
      proxies: [ProxyBar]
    });
  });

  test('renders new proxy', () => {
    expect(wrapper.find(ProxyBar).length).toBe(1);
  });
});
