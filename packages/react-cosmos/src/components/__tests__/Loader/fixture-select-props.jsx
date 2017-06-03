import React from 'react';
import { mount } from 'enzyme';
import Loader from '../../Loader';

// Objects to check identity against
const ProxyFoo = () => <span />;
const ProxyBar = () => <span />;
const ComponentFoo = <span />;
const fixtureFoo = { foo: 'bar' };

// Vars populated in beforeEach blocks
let wrapper;
let firstProxyWrapper;
let firstProxyProps;

describe('Fixture is selected via props', () => {
  beforeEach(() => {
    wrapper = mount(
      <Loader
        proxies={[ProxyFoo, ProxyBar]}
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

    firstProxyWrapper = wrapper.find(ProxyFoo);
    firstProxyProps = firstProxyWrapper.props();
  });

  test('renders first proxy ', () => {
    expect(firstProxyWrapper.length).toBe(1);
  });

  test('sets first proxy element key ', () => {
    expect(firstProxyWrapper.key()).toBeDefined();
  });

  test('sends next proxy to first proxy ', () => {
    expect(firstProxyProps.nextProxy.value).toBe(ProxyBar);
  });

  test('sends component to first proxy ', () => {
    expect(firstProxyProps.component).toBe(ComponentFoo);
  });

  test('sends fixture to first proxy', () => {
    expect(firstProxyProps.fixture).toEqual(fixtureFoo);
  });

  test('sends onFixtureUpdate cb to first proxy ', () => {
    expect(firstProxyProps.onFixtureUpdate).toBe(wrapper.instance().onFixtureUpdate);
  });
});
