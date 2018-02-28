import React from 'react';
import { mount } from 'enzyme';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, ID_KEY } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
import fetchMock from 'fetch-mock';
import until from 'async-until';
import createApolloProxy from '../index';
import exampleFixture from '../../../../examples/apollo/components/__fixtures__/Author/mock-with-mutation';

global.fetch = fetch;

// The final responsibility of proxies is to render the user's component at
// the end of the proxy chain. While it goes beyond unit testing, testing a
// complete proxy chain provides a clearer picture than solely dissecting the
// props that the tested proxy passes to the next.
const NextProxy = props => {
  const { value: P, next } = props.nextProxy;

  return <P {...props} nextProxy={next()} />;
};

const LastProxy = ({ fixture }) => <fixture.component {...fixture.props} />;

// Vars populated from scratch before each test
let onFixtureUpdate;
let wrapper;

const setupTestWrapper = ({ proxyConfig, fixture } = {}) => {
  // Create Proxy with default options
  const ApolloProxy = createApolloProxy(proxyConfig);

  // Fixture updates from inner proxies need to bubble up to the root proxy
  onFixtureUpdate = () => {
    console.log('updating fixture!');
  };

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
      fixture={fixture || exampleFixture}
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

describe('proxy configured with a client', () => {
  let client;

  beforeEach(() => {
    client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({ uri: 'https://xyz' })
    });

    setupTestWrapper({ proxyConfig: { client } });
  });

  it('uses the client passed in the config', () => {
    expect(wrapper.instance().client).toBe(client);
  });

  it('connects to the Apollo DevTools', () => {
    expect(parent.__APOLLO_CLIENT__).toBe(client);
  });
});

describe('proxy configured with an endpoint', () => {
  const mockedResponse = {
    data: {
      author: {
        __typename: 'Author',
        id: 0,
        [ID_KEY]: 'Author:0',
        firstName: 'Jane Dough',
        posts: [
          {
            __typename: 'Post',
            id: 0,
            [ID_KEY]: 'Post:0',
            title: 'Play pipo with class',
            votes: 42
          }
        ]
      }
    }
  };

  fetchMock.post('https://xyz', mockedResponse);

  const getWrappedComponent = () => {
    return wrapper.find(exampleFixture.component.WrappedComponent);
  };

  it('uses a default http link if the fixture is not mocked', async () => {
    setupTestWrapper({
      proxyConfig: {
        endpoint: 'https://xyz'
      },
      fixture: {
        component: exampleFixture.component,
        props: {
          authorId: 1
        }
      }
    });

    await until(() => {
      // note: why do we need to update manually the wrapper?
      wrapper.update();

      return !getWrappedComponent().props().data.loading;
    });

    expect(getWrappedComponent().props().data.author).toEqual(
      mockedResponse.data.author
    );
  });
});
