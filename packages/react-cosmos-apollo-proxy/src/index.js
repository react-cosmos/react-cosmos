import React, { Component } from 'react';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import { ApolloProvider } from 'react-apollo';
import { proxyPropTypes } from 'react-cosmos-shared/lib/react';

const defaults = {
  // Must provide schema definition with query type or a type named Query.
  typeDefs: `type Query { hello: String }`,
  context: {},
  rootValue: {}
};

export default function createApolloProxy(options) {
  const { typeDefs, mocks, context, rootValue } = { ...defaults, ...options };

  const schema = makeExecutableSchema({ typeDefs });

  if (mocks) {
    addMockFunctionsToSchema({ schema, mocks });
  }

  class ApolloProxy extends Component {
    constructor(props) {
      super(props);

      this.client = new ApolloClient({
        cache: new InMemoryCache(),
        link: new SchemaLink({
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
