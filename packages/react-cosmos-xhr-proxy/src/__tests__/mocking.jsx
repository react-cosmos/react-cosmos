import React from 'react';
import { shallow } from 'enzyme';
import createXhrProxy from '../';

// Vars populated in beforeEach blocks
let XhrProxy;
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
  XhrProxy = createXhrProxy();

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
      <XhrProxy
        nextProxy={nextProxy}
        component={Component}
        fixture={{
          foo: 'bar',
          xhr: [
            {
              url: '/users',
              response: (req, res) =>
                res.status(200).body([{ name: 'John' }, { name: 'Jessica' }]),
            },
            {
              url: '/user',
              method: 'POST',
              response: (req, res) => {
                const { id } = req.body();
                return res.status(200).body({
                  id,
                  name: 'John Doe',
                });
              },
            },
            {
              url: '/user',
              method: 'DELETE',
              response: () => null,
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

describe('xhr mocking', () => {
  test('returns mocked object from GET request', done => {
    expect.assertions(1);

    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/users');
    xhr.onload = () => {
      try {
        expect(xhr.responseText).toEqual([
          { name: 'John' },
          { name: 'Jessica' },
        ]);
        done();
      } catch (err) {
        done.fail(err);
      }
    };
    xhr.onerror = err => {
      done.fail(err);
    };
    xhr.send();
  });

  test('returns function mock from POST request', done => {
    expect.assertions(1);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/user');
    xhr.onload = () => {
      try {
        expect(xhr.responseText).toEqual({ id: 5, name: 'John Doe' });
        done();
      } catch (err) {
        done.fail(err);
      }
    };
    xhr.onerror = err => {
      done.fail(err);
    };
    xhr.send({
      id: 5,
    });
  });

  test('returns error from DELETE request', done => {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/user');
    xhr.onerror = () => {
      done();
    };
    xhr.send();
  });
});
