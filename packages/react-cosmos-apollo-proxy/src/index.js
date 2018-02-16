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

      const mockKeys = ['resolveWith', 'failWith'];
      const fixtureApolloKeys = flatObjectKeys(
        mockKeys,
        this.props.fixture[fixtureKey] || {}
      );

      const isMockedFixture = !!mockKeys.find(key =>
        fixtureApolloKeys.includes(key)
      );

      this.client =
        client ||
        new ApolloClient({
          cache: new InMemoryCache(),
          link: new HttpLink({ uri: endpoint })
        });

      if (isMockedFixture) {
        const link = createFixtureLink(this.props.fixture[fixtureKey]).request;

        this.client.link = link;
      }
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

export const flatObjectKeys = (keys, object, digNestedObjects = true) => {
  return Object.entries(object).reduce((list, [key, value]) => {
    if (!keys.includes(key) && typeof value === 'object' && digNestedObjects) {
      return [...list, ...flatObjectKeys(keys, value, false)];
    }

    return [...list, key];
  }, []);
};
