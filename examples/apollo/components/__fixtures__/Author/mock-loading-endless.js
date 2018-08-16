import Author from '../../Author';

export default {
  component: Author,

  props: {
    authorId: 123
  },
  apollo: {
    latency: -1,
    resolveWith: {
      author: {
        __typename: 'Author',
        id: 123,
        firstName: 'Ovidiu',
        posts: [
          {
            __typename: 'Post',
            id: 456,
            title: 'Testing React Components',
            votes: 1234
          },
          { __typename: 'Post', id: 789, title: 'When to assert?', votes: 56 }
        ]
      }
    }
  }
};
