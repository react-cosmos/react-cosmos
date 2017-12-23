import React, { Component } from 'react';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { SchemaLink } from 'apollo-link-schema';
import { ApolloProvider } from 'react-apollo';
import { proxyPropTypes } from 'react-cosmos-shared/lib/react';

const defaults = {
  fixtureKey: 'apollo',
  context: {},
  rootValue: {}
};

export default function createApolloProxy(options) {
  const { endpoint, client, schema, context, rootValue } = {
    ...defaults,
    ...options
  };

  class ApolloProxy extends Component {
    constructor(props) {
      super(props);

      if (!endpoint && !client && !schema) {
        throw new Error(
          `
It looks the Apollo Proxy is not configured! 
Give it:
- a GraphQL endpoint to send GraphQL operations to;
- a configured Apollo Client (maybe the one you use in your app?);
- a local schema built with graphql-tools or a link pointing to a GraphQL endpoint.
Read more at: https://github.com/react-cosmos/react-cosmos#react-apollo-graphql.`
        );
      }

      this.client =
        client ||
        new ApolloClient({
          cache: new InMemoryCache(),
          link: endpoint
            ? new HttpLink({ uri: endpoint })
            : new SchemaLink({
                schema,
                context,
                rootValue
              })
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
