import React from 'react';
import { mount } from 'enzyme';
import createApolloProxy from '../index';
import fixture from '../../../../examples/apollo/components/__fixtures__/Author/mock-with-mutation';

// The final responsibility of proxies is to render the user's component at
// the end of the proxy chain. While it goes beyond unit testing, testing a
// complete proxy chain provides a clearer picture than solely dissecting the
// props that the tested proxy passes to the next.
const NextProxy = props => {
  const { value: P, next } = props.nextProxy;

  return <P {...props} nextProxy={next()} />;
};

const LastProxy = ({ fixture }) => <fixture.component />;

// Vars populated from scratch before each test
let onFixtureUpdate;
let wrapper;

const setupTestWrapper = proxyConfig => {
  // Create Proxy with default options
  const ApolloProxy = createApolloProxy(proxyConfig);

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
      fixture={fixture}
      onComponentRef={() => {}}
      onFixtureUpdate={onFixtureUpdate}
    />
  );
};

describe('proxy not configured', () => {
  // don't show the error in the console (cosmetic purpose)
  const originalConsoleError = console.error;
  beforeAll(() => (console.error = () => {}));

  it('throws an error', () => {
    expect(() => setupTestWrapper()).toThrow();
  });

  afterAll(() => (console.error = originalConsoleError));
});
