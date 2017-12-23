import createApolloProxy from 'react-cosmos-apollo-proxy';

// see more examples at:
// https://github.com/react-cosmos/react-cosmos#react-apollo-graphql

// most simple config for real data
export default [
  createApolloProxy({
    endpoint: 'https://1jzxrj179.lp.gql.zone/graphql'
  })
];

// most simple config for mocked data
// import schema from './local-schema';

// export default [
//   createApolloProxy({
//     schema
//   })
// ];
