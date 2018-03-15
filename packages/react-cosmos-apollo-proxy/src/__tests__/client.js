import React from 'react';
import { mount } from 'enzyme';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, ID_KEY } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import fetch from 'node-fetch';
import fetchMock from 'fetch-mock';
import until from 'async-until';
import createApolloProxy from '../index';

const sampleQuery = gql`
  query SampleQuery($authorId: Int!) {
    author(authorId: $authorId) {
      id
      firstName
    }
  }
`;

const SampleComponent = ({ data }) => {
  if (data.loading) {
    return <span>Loading</span>;
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return <span>{data.author.firstName}</span>;
};

const withData = graphql(sampleQuery, {
  options: ({ authorId }) => ({ variables: { authorId } })
});

const sampleFixture = {
  component: withData(SampleComponent),
  props: {
    authorId: 1
  }
};

// used under the hood by HttpLink
global.fetch = fetch;

// render the component fixture
const LastProxy = ({ fixture }) => <fixture.component {...fixture.props} />;

// vars populated from scratch before each test
let onFixtureUpdate;
let wrapper;

// utility to get the fixture wrapped component
const getWrappedComponent = () => {
  wrapper.update();

  return wrapper.find(sampleFixture.component.WrappedComponent);
};

// utility to instantiate the proxy and the fixture
const setupTestWrapper = ({ proxyConfig, fixture } = {}) => {
  // create Proxy with default options
  const ApolloProxy = createApolloProxy(proxyConfig);

  onFixtureUpdate = jest.fn();

  wrapper = mount(
    <ApolloProxy
      nextProxy={{
        value: LastProxy,
        next: () => {}
      }}
      fixture={fixture || sampleFixture}
      onComponentRef={() => {}}
      onFixtureUpdate={onFixtureUpdate}
    />
  );
};

describe('proxy not configured', () => {
  // don't show the error in the console (cosmetic purpose)
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = () => {};
  });

  it('throws an error', () => {
    expect(() => setupTestWrapper()).toThrow();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });
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
  const resolveWith = {
    author: {
      __typename: 'Author',
      id: 1,
      firstName: 'Jane Dough',
      [ID_KEY]: 'Author:1'
    }
  };

  beforeAll(() => {
    fetchMock.post('https://xyz', { data: resolveWith });
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it('uses a default http link if the fixture has not mocked data', async () => {
    setupTestWrapper({
      proxyConfig: {
        endpoint: 'https://xyz'
      }
    });

    expect(fetchMock.called('https://xyz', 'POST')).toBe(true);

    // wait for the fake network request to complete
    await until(() => !getWrappedComponent().props().data.loading);

    expect(getWrappedComponent().props().data.author).toEqual(
      resolveWith.author
    );
  });

  it('uses a fixture link if the fixture has mocked data', async () => {
    setupTestWrapper({
      proxyConfig: {
        endpoint: 'https://xyz'
      },
      fixture: {
        ...sampleFixture,
        apollo: {
          resolveWith
        }
      }
    });

    // no network requests issued
    expect(fetchMock.called('https://xyz', 'POST')).toBe(false);

    // no loading because synchronous return of the fixture data
    expect(getWrappedComponent().props().data.loading).toBe(false);

    expect(getWrappedComponent().props().data.author).toEqual(
      resolveWith.author
    );
  });
});
