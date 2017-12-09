import React, { Component } from 'react';
import { graphql } from 'react-apollo';
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

class Author extends Component {
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
        <ul>{author.posts.map(post => <li key={post.id}>{post.title}</li>)}</ul>
      </div>
    );
  }
}

export default withData(Author);
