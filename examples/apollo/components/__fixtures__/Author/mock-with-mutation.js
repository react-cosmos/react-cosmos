import Author, { QUERY } from '../../Author';

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
      resolveWith: ({ cache, variables, fixture }) => {
        const data = cache.readQuery({
          query: QUERY,
          variables: { authorId: fixture.props.authorId }
        });

        const post = data.author.posts.find(
          post => post.id === variables.postId
        );

        return {
          upvotePost: {
            ...post,
            votes: post.votes + 10
          }
        };
      }
    }
  }
};
