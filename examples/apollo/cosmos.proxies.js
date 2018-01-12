import createApolloProxy from 'react-cosmos-apollo-proxy';

// see more examples at:
// https://github.com/react-cosmos/react-cosmos#react-apollo-graphql

export default [
  createApolloProxy({
    endpoint: 'https://1jzxrj179.lp.gql.zone/graphql'
  })
];
