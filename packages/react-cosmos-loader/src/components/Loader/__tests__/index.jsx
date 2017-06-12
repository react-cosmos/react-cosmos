import React from 'react';
import { mount } from 'enzyme';
import PropsProxy from '../../PropsProxy';
import Loader from '../';

// Objects to check identity against
const ProxyFoo = () => <span />;
const ComponentFoo = () => <span />;
const fixtureFoo = { foo: 'bar' };
const onComponentRef = () => {};

// Vars populated in beforeEach blocks
let wrapper;
let firstProxyWrapper;
let firstProxyProps;

describe('Fixture is selected via props', () => {
  beforeEach(() => {
    wrapper = mount(
      <Loader
        proxies={[ProxyFoo]}
        component={ComponentFoo}
        fixture={fixtureFoo}
        onComponentRef={onComponentRef}
      />
    );

    firstProxyWrapper = wrapper.find(ProxyFoo);
    firstProxyProps = firstProxyWrapper.props();
  });

  test('renders first proxy ', () => {
    expect(firstProxyWrapper.length).toBe(1);
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
