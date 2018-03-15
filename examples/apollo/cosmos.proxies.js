import createApolloProxy from 'react-cosmos-apollo-proxy';

// see more examples at:
// https://github.com/react-cosmos/react-cosmos#react-apollo-graphql

export default [
  createApolloProxy({
    // how to run the example with real data:
    // use the local graphql api: cd .local-graphql-api
    // install dependencies: yarn
    // run the server: yarn start
    endpoint: 'http://localhost:1337/graphql'
  })
];
