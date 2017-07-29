import React from 'react';
import { shallow } from 'enzyme';
import createFetchProxy from '../';

// Vars populated in beforeEach blocks
let FetchProxy;
let NextProxy;
let nextProxyNext;
let nextProxy;
let Component;
let componentRef;
let onComponentRef;
let onFixtureUpdate;
let wrapper;
let props;

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
  componentRef = {};
  onComponentRef = jest.fn();
  onFixtureUpdate = jest.fn();

  return new Promise(resolve => {
    wrapper = shallow(
      <FetchProxy
        nextProxy={nextProxy}
        component={Component}
        fixture={{
          foo: 'bar',
          fetch: [
            {
              matcher: '/users',
              response: [{ name: 'John' }, { name: 'Jerry' }],
            },
          ],
        }}
        onComponentRef={ref => {
          onComponentRef(ref);
          resolve();
        }}
        onFixtureUpdate={onFixtureUpdate}
      />
    );

    // These are the props of the next proxy
    props = wrapper.props();

    // Simulate rendering
    props.onComponentRef(componentRef);
  });
});

afterEach(() => {
  wrapper.unmount();
});

describe('next proxy', () => {
  test('renders next proxy in line', () => {
    expect(wrapper.type()).toBe(NextProxy);
  });

  test('sends nextProxy.next() to next proxy', () => {
    expect(props.nextProxy).toBe(nextProxyNext);
  });

  test('sends component to next proxy', () => {
    expect(props.component).toBe(Component);
  });

  test('sends fixture to next proxy', () => {
    expect(props.fixture.foo).toEqual('bar');
  });

  test('bubbles up component ref', () => {
    expect(onComponentRef.mock.calls[0][0]).toBe(componentRef);
  });

  test('bubbles up fixture updates', () => {
    props.onFixtureUpdate({});
    expect(onFixtureUpdate.mock.calls).toHaveLength(1);
  });
});

describe('fetch mocking', () => {
  test('returns mocked data', () => {
    expect.assertions(1);

    return fetch('/users').then(response =>
      response
        .json()
        .then(response =>
          expect(response).toEqual([{ name: 'John' }, { name: 'Jerry' }])
        )
    );
  });
});
