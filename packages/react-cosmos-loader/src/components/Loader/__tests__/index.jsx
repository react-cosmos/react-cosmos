import React from 'react';
import { mount } from 'enzyme';
import PropsProxy from '../../PropsProxy';
import Loader from '../';

// Objects to check identity against
const ProxyFoo = () => <span />;
const createProxyFoo = () => ProxyFoo;
const ComponentFoo = () => <span />;
const ComponentFooModule = {
  __esModule: true,
  default: ComponentFoo,
};
const fixtureFoo = { foo: 'bar' };
const fixtureFooModule = {
  __esModule: true,
  default: fixtureFoo,
};
const onComponentRef = () => {};

// Vars populated in beforeEach blocks
let wrapper;
let firstProxyWrapper;
let firstProxyProps;

describe('Fixture is selected via props', () => {
  beforeEach(() => {
    wrapper = mount(
      <Loader
        proxies={[createProxyFoo]}
        component={ComponentFooModule}
        fixture={fixtureFooModule}
        onComponentRef={onComponentRef}
      />
    );

    firstProxyWrapper = wrapper.find(ProxyFoo);
    firstProxyProps = firstProxyWrapper.props();
  });

  test('renders first proxy ', () => {
    expect(firstProxyWrapper).toHaveLength(1);
  });

  test('sends PropsProxy to first proxy ', () => {
    expect(firstProxyProps.nextProxy.value).toBe(PropsProxy);
  });

  test('sends component to first proxy ', () => {
    expect(firstProxyProps.component).toBe(ComponentFoo);
  });

  test('sends fixture to first proxy', () => {
    expect(firstProxyProps.fixture).toEqual(fixtureFoo);
  });

  test('sends onComponentRef to first proxy', () => {
    expect(firstProxyProps.onComponentRef).toEqual(onComponentRef);
  });
});
