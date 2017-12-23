// local for the proxy
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

const typeDefs = `
  type Query {
    author(id: Int!): Author
  }

  type Author {
    id: Int!
    firstName: String
    posts: [Post]
  }

  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }
`;

const mocks = {
  Query: () => ({
    author: (root, { id }) => ({
      id,
      firstName: id === 1 ? 'Ovidiu' : 'You'
    })
  }),
  Post: () => ({
    title: Math.random() > 0.5 ? 'About Cosmos' : 'The story of Life',
    votes: 42
  })
};

const schema = makeExecutableSchema({ typeDefs });

addMockFunctionsToSchema({ schema, mocks });

export default schema;
