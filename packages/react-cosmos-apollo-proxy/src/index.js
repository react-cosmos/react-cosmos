import React, { Component } from 'react';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import { ApolloProvider } from 'react-apollo';
import { proxyPropTypes } from 'react-cosmos-shared/lib/react';

const defaults = {
  context: {},
  rootValue: {}
};

export default function createApolloProxy(options) {
  const { link, schema, context, rootValue } = {
    ...defaults,
    ...options
  };

  class ApolloProxy extends Component {
    constructor(props) {
      super(props);

      if (!link && !schema) {
        throw new Error(
          `It looks the Apollo Proxy is missing a schema instance! 
          Pass it a local schema built with graphql-tools or a link pointing to a GraphQL endpoint.
          Read more at: https://github.com/react-cosmos/react-cosmos#react-apollo-graphql.`
        );
      }

      if (schema && link) {
        throw new Error(
          `It looks like the Apollo Proxy is configured with both a schema & an Apollo Link!
          You can  either just pass a local schema instance, or build your own link to connect to the schema you want to use.
          Read more at: https://github.com/react-cosmos/react-cosmos#react-apollo-graphql.`
        );
      }

      this.client = new ApolloClient({
        cache: new InMemoryCache(),
        link:
          link ||
          new SchemaLink({
            schema,
            context,
            rootValue
          })
      });

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

  ApolloProxy.propTypes = proxyPropTypes;

  return ApolloProxy;
}
