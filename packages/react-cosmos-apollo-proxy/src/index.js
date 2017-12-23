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
  const { fixtureKey, endpoint, client, schema, context, rootValue } = {
    ...defaults,
    ...options
  };

  class ApolloProxy extends Component {
    constructor(props) {
      super(props);

      if (!endpoint && !client && !schema) {
        console.warn(
          `It looks the Apollo Proxy is not configured! 
          Pass it:
          - a GraphQL endpoint to send GraphQL operations to;
          - a configured Apollo Client (maybe the one you use in your app?);
          - a local schema built with graphql-tools or a link pointing to a GraphQL endpoint.
          Read more at: https://github.com/react-cosmos/react-cosmos#react-apollo-graphql.`
        );

        return;
      }

      const { cache } = props.fixture[fixtureKey] || {};

      this.client =
        client ||
        new ApolloClient({
          cache: new InMemoryCache().restore(cache),
          link: endpoint
            ? new HttpLink({ uri: endpoint })
            : new SchemaLink({
                schema,
                context,
                rootValue
              })
        });

      this.onBroadcast = this.onBroadcast.bind(this);

      // hook Cosmos on the callback designed for the Apollo Client DevTools Chrome Extension 😇
      this.client.__actionHookForDevTools(this.onBroadcast);
    }
    onBroadcast({ state, dataWithOptimisticResults: cache }) {
      if (isEmptyObject(state.queries) && isEmptyObject(state.mutations)) {
        console.log('// empty broadcast!');
        return;
      }
      console.log('// updating fixture with new cache', JSON.stringify(cache));
      this.props.onFixtureUpdate({
        [fixtureKey]: {
          cache
        }
      });
    }
    render() {
      const { value: NextProxy, next } = this.props.nextProxy;

      if (!this.client) {
        return <NextProxy {...this.props} nextProxy={next()} />;
      }
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
function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}
