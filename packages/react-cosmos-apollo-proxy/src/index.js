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

      const { resolveWith, failWith } = this.props.fixture[fixtureKey] || {};

      this.client =
        client ||
        new ApolloClient({
          cache: new InMemoryCache(),
          link: new HttpLink({ uri: endpoint })
        });

      if (resolveWith || failWith) {
        const link = createFixtureLink({ resolveWith, failWith }).request;

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
