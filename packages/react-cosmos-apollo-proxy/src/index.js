import React, { Component } from 'react';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { graphql, print } from 'graphql';
import { ApolloProvider, ApolloClient } from 'react-apollo';
import { proxyPropTypes } from 'react-cosmos-shared';

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
        networkInterface: {
          query(request) {
            return graphql(
              schema,
              print(request.query),
              rootValue,
              context,
              request.variables,
              request.operationName
            );
          }
        }
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
