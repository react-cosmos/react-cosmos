import React, { Component } from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import { proxyPropTypes } from 'react-cosmos-shared/lib/react';
import { createFixtureLink } from './fixtureLink';

const defaults = {
  fixtureKey: 'apollo'
};

// utility to find mock keys inside a fixture
export const flatObjectKeys = (keys, object, digNestedObjects = true) => {
  return Object.entries(object).reduce((list, [key, value]) => {
    if (!keys.includes(key) && typeof value === 'object' && digNestedObjects) {
      // only "dig" one level deep
      return [...list, ...flatObjectKeys(keys, value, false)];
    }

    return [...list, key];
  }, []);
};

export default function createApolloProxy(options) {
  const { fixtureKey, endpoint, client } = {
    ...defaults,
    ...options
  };

  class ApolloProxy extends Component {
    constructor(props) {
      super(props);

      if (!endpoint && !client) {
        throw new Error(
          `
It looks the Apollo Proxy is not configured!
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
          link: isMockedFixture
            ? createFixtureLink({ apolloFixture, cache })
            : new HttpLink({ uri: endpoint })
        });
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

  ApolloProxy.propTypes = proxyPropTypes;

  return ApolloProxy;
}
