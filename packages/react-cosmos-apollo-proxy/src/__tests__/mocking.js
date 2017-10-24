import React from 'react';
import { mount } from 'enzyme';
import createApolloProxy from '../';
import { ApolloClient, ApolloProvider } from 'react-apollo';

// The final responsibility of proxies is to render the user's component at
// the end of the proxy chain. While it goes beyond unit testing, testing a
// complete proxy chain provides a clearer picture than solely dissecting the
// props that the tested proxy passes to the next.
const Component = () => <span>__COMPONENT_MOCK__</span>;

const NextProxy = props => {
  const { value: P, next } = props.nextProxy;

  return <P {...props} nextProxy={next()} />;
};

const LastProxy = ({ fixture }) => <fixture.component />;

// Vars populated from scratch before each test
let onFixtureUpdate;
let wrapper;

beforeEach(() => {
  // The Apollo Client is created for each test
  ApolloClient.mockReset();

  // Create Proxy with default options
  const ApolloProxy = createApolloProxy();

  // Fixture updates from inner proxies need to bubble up to the root proxy
  onFixtureUpdate = jest.fn();

  // Mouting is more useful because it calls lifecycle methods and enables
  // DOM interaction
  wrapper = mount(
    <ApolloProxy
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
      fixture={{
        component: Component,
        // Except for some rare cases, the proxy needs to pass along the
        // fixture without changing it
        foo: 'bar'
      }}
      onComponentRef={() => {}}
      onFixtureUpdate={onFixtureUpdate}
    />
  );
});

test('renders next proxy', () => {
  expect(wrapper.find(NextProxy)).toHaveLength(1);
});

test('renders component', () => {
  expect(wrapper.text()).toEqual('__COMPONENT_MOCK__');
});

describe('next proxy props', () => {
  let nextProxyProps;

  beforeEach(() => {
    nextProxyProps = wrapper.find(NextProxy).props();
  });

  test('sends fixture to next proxy', () => {
    expect(nextProxyProps.fixture).toEqual({
      component: Component,
      foo: 'bar'
    });
  });

  test('passes 2nd next proxy to next proxy', () => {
    expect(nextProxyProps.nextProxy.value).toBe(LastProxy);
  });

  test('bubbles up fixture updates', () => {
    nextProxyProps.onFixtureUpdate({});
    expect(onFixtureUpdate.mock.calls).toHaveLength(1);
  });
});

test('creates the Apollo client', () => {
  expect(ApolloClient).toHaveBeenCalledTimes(1);
});

test('renders the Apollo provider', () => {
  expect(wrapper.find(ApolloProvider)).toHaveLength(1);
});
