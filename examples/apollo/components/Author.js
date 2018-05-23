import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

export const GET_POSTS = gql`
  query PostsForAuthor($authorId: Int!) {
    author(id: $authorId) {
      id
      firstName
      posts {
        id
        title
        votes
      }
    }
  }
`;

export const UPVOTE_POST = gql`
  mutation UpvotePost($postId: Int!) {
    upvotePost(postId: $postId) {
      id
      title
      votes
    }
  }
`;

export default class Author extends Component {
  render() {
    const { authorId, upvoteEnabled } = this.props;

    return (
      <Query query={GET_POSTS} variables={{ authorId }}>
        {({ loading, error, data }) => {
          if (loading) {
            return <div>Loading...</div>;
          }

          if (error) {
            return <div style={{ color: 'red' }}>{error.message}</div>;
          }

          const { author } = data;

          return (
            <div>
              <div>Author: {author.firstName}</div>
              <ul>
                {author.posts.map(({ id: postId, title, votes }) => (
                  <Mutation key={postId} mutation={UPVOTE_POST}>
                    {(upvotePost, { loading }) => (
                      <li>
                        {`${title} ${votes} votes `}
                        {upvoteEnabled && (
                          <button
                            disabled={loading}
                            onClick={() =>
                              upvotePost({ variables: { postId } })
                            }
                          >
                            Upvote
                          </button>
                        )}
                      </li>
                    )}
                  </Mutation>
                ))}
              </ul>
            </div>
          );
        }}
      </Query>
    );
  }
}
