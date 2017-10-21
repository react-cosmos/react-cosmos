import React from 'react';
import { mount } from 'enzyme';
import PropsProxy from '../../PropsProxy';
import Loader from '../';

// Objects to check identity against
const ProxyFoo = () => <span />;
const fixtureFoo = { foo: 'bar' };
const onComponentRef = () => {};

// Vars populated in beforeEach blocks
let wrapper;
let firstProxyWrapper;
let firstProxyProps;
let onFixtureUpdate;

describe('Fixture is selected via props', () => {
  beforeEach(() => {
    onFixtureUpdate = jest.fn();

    wrapper = mount(
      <Loader
        proxies={[ProxyFoo]}
        fixture={fixtureFoo}
        onComponentRef={onComponentRef}
        onFixtureUpdate={onFixtureUpdate}
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

  test('sends fixture to first proxy', () => {
    expect(firstProxyProps.fixture).toEqual(fixtureFoo);
  });

  test('sends onComponentRef to first proxy', () => {
    expect(firstProxyProps.onComponentRef).toEqual(onComponentRef);
  });

  test('bubbles up fixture updates', () => {
    firstProxyProps.onFixtureUpdate({});
    expect(onFixtureUpdate.mock.calls).toHaveLength(1);
  });
});
