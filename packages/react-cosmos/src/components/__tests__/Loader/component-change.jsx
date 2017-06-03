import React from 'react';
import { mount } from 'enzyme';
import Loader from '../../Loader';

// Objects to check identity against
const ProxyFoo = () => <span />;
const ComponentFoo = <span />;
const ComponentFoo2 = <span />;
const fixtureFoo = {};

// Vars populated in beforeEach blocks
let wrapper;
let firstProxyWrapper;

describe('Component source changes', () => {
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
      components: {
        Foo: ComponentFoo2
      }
    });

    firstProxyWrapper = wrapper.find(ProxyFoo);
  });

  test('sends new component to proxies', () => {
    expect(firstProxyWrapper.props().component).toBe(ComponentFoo2);
  });
});
