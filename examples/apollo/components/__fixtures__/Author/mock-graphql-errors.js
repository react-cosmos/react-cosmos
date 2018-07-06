import Author from '../../Author';

export default {
  component: Author,

  props: {
    authorId: 123,
    upvoteEnabled: true
  },
  apollo: {
    PostsForAuthor: {
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
    },
    UpvotePost: {
      resolveWith: {
        data: {
          upvotePost: null
        },
        errors: [
          {
            path: ['upvotePost'],
            message: [
              'This is an example of a graphQL error, e.g. "you have already upvoted this"'
            ],
            locations: [{ line: 1, column: 0 }]
          }
        ]
      }
    }
  }
};
