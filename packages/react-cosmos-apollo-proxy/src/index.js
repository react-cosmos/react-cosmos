import React, { Component } from 'react';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import { ApolloProvider } from 'react-apollo';
import { proxyPropTypes } from 'react-cosmos-shared/lib/react';

const defaults = {
  fixtureKey: 'apollo',
  context: {},
  rootValue: {}
};

export default function createApolloProxy(options) {
  const { fixtureKey, link, schema, context, rootValue } = {
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
        cache: new InMemoryCache().restore(
          this.props.fixture[fixtureKey] || {}
        ),
        link:
          link ||
          new SchemaLink({
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
        [fixtureKey]: cache
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
function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}
