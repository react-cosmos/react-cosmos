import React, { Component } from 'react';
import { graphql, gql } from 'react-apollo';

const withData = graphql(
  gql`
    query hello($who: String) {
      hello(who: $who)
    }
  `,
  {
    options: ({ who }) => ({
      variables: { who }
    })
  }
);

class Hello extends Component {
  render() {
    const { data: { loading, error, hello } } = this.props;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return (
        <div style={{ color: 'red' }}>
          {error}
        </div>
      );
    }

    return (
      <div>
        {hello}
      </div>
    );
  }
}

export default withData(Hello);
