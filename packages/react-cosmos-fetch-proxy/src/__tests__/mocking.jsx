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
              response: [{ name: 'John' }, { name: 'Jessica' }],
            },
            {
              matcher: '/user',
              method: 'POST',
              response: (url, { body }) => {
                return {
                  id: body.id,
                  name: 'John Doe',
                };
              },
            },
            {
              matcher: '/user',
              method: 'DELETE',
              response: {
                throws: 'Not allowed',
              },
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
  test('returns mocked object from GET request', () => {
    expect.assertions(1);

    return fetch('/users').then(response =>
      response
        .json()
        .then(response =>
          expect(response).toEqual([{ name: 'John' }, { name: 'Jessica' }])
        )
    );
  });

  test('returns function mock from POST request', () => {
    expect.assertions(1);

    return fetch('/user', {
      method: 'POST',
      body: {
        id: 5,
      },
    }).then(response =>
      response
        .json()
        .then(response => expect(response).toEqual({ id: 5, name: 'John Doe' }))
    );
  });

  test('returns error from DELETE request', () => {
    expect.assertions(1);

    return fetch('/user', {
      method: 'DELETE',
      body: {
        id: 5,
      },
    }).catch(err => expect(err).toEqual('Not allowed'));
  });
});
