import createApolloProxy from 'react-cosmos-apollo-proxy';

// remote setup of the proxy
import { HttpLink } from 'apollo-link-http';

const link = new HttpLink({ uri: 'https://1jzxrj179.lp.gql.zone/graphql' });

export default [createApolloProxy({ link })];

// // local setup of the proxy
// import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

// const typeDefs = `
//   type Query {
//     author(id: Int!): Author
//   }

//   type Author {
//     id: Int!
//     firstName: String
//     posts: [Post]
//   }

//   type Post {
//     id: Int!
//     title: String
//     author: Author
//     votes: Int
//   }
// `;

// const mocks = {
//   Query: () => ({
//     author: (root, { id }) => ({
//       id,
//       firstName: id === 1 ? 'Ovidiu' : 'You'
//     })
//   }),
//   Post: () => ({
//     title: Math.random() > 0.5 ? 'About Cosmos' : 'The story of Life',
//     votes: 42
//   })
// };

// const schema = makeExecutableSchema({ typeDefs });

// addMockFunctionsToSchema({ schema, mocks });

// export default [createApolloProxy({ schema })];
