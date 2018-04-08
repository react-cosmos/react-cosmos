import React, { Component } from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import { proxyPropTypes } from 'react-cosmos-shared/react';
import { createFixtureLink } from './fixtureLink';

const defaults = {
  fixtureKey: 'apollo'
};

export function createApolloProxy(options) {
  const { fixtureKey, endpoint, client } = {
    ...defaults,
    ...options
  };

  class ApolloProxy extends Component {
    static propTypes = proxyPropTypes;

    constructor(props) {
      super(props);

      if (!endpoint && !client) {
        throw new Error(
          `
It looks like the Apollo Proxy is not configured!
Give it:
- a GraphQL endpoint to send GraphQL operations to;
- a configured Apollo Client (maybe the one you use in your app?);
Read more at: https://github.com/react-cosmos/react-cosmos#react-apollo-graphql.`
        );
      }

      const apolloFixture = this.props.fixture[fixtureKey] || {};
      const mockKeys = ['resolveWith', 'failWith'];

      const fixtureApolloKeys = flatObjectKeys(mockKeys, apolloFixture);

      const isMockedFixture = Boolean(
        mockKeys.find(key => fixtureApolloKeys.includes(key))
      );

      const cache = new InMemoryCache();

      this.client =
        client ||
        new ApolloClient({
          cache,
          link: new HttpLink({ uri: endpoint })
        });

      if (isMockedFixture) {
        this.client.link = createFixtureLink({
          apolloFixture,
          cache,
          fixture: this.props.fixture
        });
      }

      // enable the Apollo Client DevTools to recognize the Apollo Client instance
      parent.__APOLLO_CLIENT__ = this.client;
    }

    render() {
      const { value: NextProxy, next } = this.props.nextProxy;

      return (
        <ApolloProvider client={this.client}>
          <NextProxy {...this.props} nextProxy={next()} />
        </ApolloProvider>
      );
    }
  }

  return ApolloProxy;
}

// Utility to find mock keys inside a fixture
function flatObjectKeys(keys, object, digNestedObjects = true) {
  return Object.keys(object).reduce((list, key) => {
    const value = object[key];
    if (!keys.includes(key) && typeof value === 'object' && digNestedObjects) {
      // only "dig" one level deep
      return [...list, ...flatObjectKeys(keys, value, false)];
    }

    return [...list, key];
  }, []);
}
