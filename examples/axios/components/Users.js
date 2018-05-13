import React, { Component } from 'react';
import axios from 'axios';

export default class Users extends Component {
  state = {
    isLoading: true,
    error: null,
    users: null
  };

  componentDidMount() {
    axios('/users')
      .then(({ data: users }) => {
        this.setState({ isLoading: false, users });
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          error: err.message
        });
      });
  }

  render() {
    const { isLoading, error, users } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div style={{ color: 'red' }}>{error}</div>;
    }

    return <ul>{users.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
  }
}
