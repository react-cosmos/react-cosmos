import React from 'react';
import { mount } from 'enzyme';
import createFetchProxy from '../';

// The final responsibility of proxies is to render the user's component at
// the end of the proxy chain. While it goes beyond unit testing, testing a
// complete proxy chain provides a clearer picture than solely dissecting the
// props that the tested proxy passes to the next.
const Component = () => <span>__COMPONENT_MOCK__</span>;

const NextProxy = props => {
  const { value: P, next } = props.nextProxy;

  return <P {...props} nextProxy={next()} />;
};

const LastProxy = ({ component: C }) => <C />;

// Vars populated from scratch before each test
let wrapper;

const mountProxy = () => {
  const FetchProxy = createFetchProxy();

  // Mouting is more useful because it calls lifecycle methods and enables
  // DOM interaction
  wrapper = mount(
    <FetchProxy
      nextProxy={{
        // Besides rendering the next proxy, we also need to ensure the 2nd
        // next proxy is passed to the next proxy for further chaining. It
        // might take a few reads to grasp this...
        value: NextProxy,
        next: () => ({
          value: LastProxy,
          next: () => {}
        })
      }}
      component={Component}
      fixture={{
        fetch: [
          {
            matcher: '/users',
            response: [{ name: 'John' }, { name: 'Jessica' }]
          }
        ]
      }}
      onComponentRef={() => {}}
      onFixtureUpdate={() => {}}
    />
  );
};

beforeEach(() => {
  mountProxy();
  const prevWrapper = wrapper;
  mountProxy();

  // Make sure we don't clear a mock from a newer instance (in React 16
  // B.constructor is called before A.componentWillUnmount)
  prevWrapper.unmount();
});

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
