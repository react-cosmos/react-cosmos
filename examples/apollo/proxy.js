import createApolloProxy from 'react-cosmos-apollo-proxy';

const typeDefs = `
  type Query {
    hello(who: String): String
  }
`;

const mocks = {
  Query: () => ({
    hello: (root, { who }) => `Hello ${who ? who : 'C O S M O S'}`
  })
};

export default () =>
  createApolloProxy({
    typeDefs,
    mocks
  });
