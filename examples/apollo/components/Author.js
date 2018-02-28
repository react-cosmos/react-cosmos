import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

const withData = graphql(
  gql`
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
  `,
  {
    options: ({ authorId }) => ({
      variables: { authorId }
    })
  }
);

const withMutation = graphql(gql`
  mutation UpvotePost($postId: Int!) {
    upvotePost(postId: $postId) {
      id
      title
      votes
    }
  }
`);

class Author extends Component {
  handleUpvote = postId => () => {
    return this.props.mutate({
      variables: { postId }
    });
  };

  render() {
    const { data: { loading, error, author } } = this.props;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div style={{ color: 'red' }}>{error.message}</div>;
    }

    return (
      <div>
        Author: {author.firstName}
        <ul>
          {author.posts.map(post => (
            <li key={post.id}>
              {post.title} - {post.votes} votes
              {this.props.upvoteEnabled && (
                <button onClick={this.handleUpvote(post.id)}>Upvote</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default compose(withData, withMutation)(Author);
