import createApolloProxy from 'react-cosmos-apollo-proxy';

// see more examples at:
// https://github.com/react-cosmos/react-cosmos#react-apollo-graphql

export default [
  createApolloProxy({
    // how to run the example with real data:
    // install dependencies: yarn
    // use the local graphql api: yarn start:server
    // [different terminal] run the server: yarn start
    endpoint: 'http://localhost:1337/graphql'
  })
];
