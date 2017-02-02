import React from 'react';
import { mount } from 'enzyme';

const mockProxyNext = {};
const mockFirstProxy = {
  value: () => <span />,
  next: () => mockProxyNext,
};
const mockGetLinkedList = jest.fn(() => mockFirstProxy);
jest.mock('react-cosmos-utils/lib/linked-list', () => mockGetLinkedList);

const mockFixtureParts = {
  unserializable: {
    onClick: jest.fn(),
  },
  serializable: {
    title: 'Lorem ipsum',
  },
};
const mockSplitUnserializableParts = jest.fn(() => mockFixtureParts);
jest.mock('react-cosmos-utils/lib/unserializable-parts', () => mockSplitUnserializableParts);

const Loader = require('../../Loader').default;

const Proxy = jest.fn();
const FooBarComponent = () => {};
const FooBarBarComponent = () => {};
const baseFixture = {};

let wrapper;
let instance;

const init = () => {
  wrapper = mount(
    <Loader
      proxies={[Proxy]}
      components={{
        FooBar: FooBarComponent,
        FooBarBar: FooBarBarComponent,
      }}
      fixtures={{
        FooBar: {
          base: baseFixture,
        },
        FooBarBar: {
          base: baseFixture,
        },
      }}
      component="FooBarBar"
      fixture="base"
    />,
  );
  instance = wrapper.instance();
};

let firstProxyWrapper;
let firstProxyProps;
let firstProxyKey;

beforeAll(() => {
  init();

  firstProxyWrapper = wrapper.find(mockFirstProxy.value);
  firstProxyProps = firstProxyWrapper.props();
  firstProxyKey = firstProxyWrapper.key();
});

test('creates linked list from proxy list', () => {
  expect(mockGetLinkedList).toHaveBeenLastCalledWith([Proxy]);
});

test('renders first proxy ', () => {
  expect(firstProxyWrapper.length).toBe(1);
});

test('sets first proxy element key ', () => {
  expect(firstProxyKey).toBeDefined();
});

test('sends next proxy to first proxy ', () => {
  expect(firstProxyProps.nextProxy).toBe(mockProxyNext);
});

test('sends component to first proxy ', () => {
  expect(firstProxyProps.component).toBe(FooBarBarComponent);
});

test('splits unserializable parts from fixture', () => {
  expect(mockSplitUnserializableParts).toHaveBeenLastCalledWith(baseFixture);
});

test('sends merged fixture parts to first proxy', () => {
  expect(firstProxyProps.fixture).toEqual({
    ...mockFixtureParts.unserializable,
    ...mockFixtureParts.serializable,
  });
});

test('sends onFixtureUpdate cb to first proxy ', () => {
  expect(firstProxyProps.onFixtureUpdate).toBe(instance.onFixtureUpdate);
});
