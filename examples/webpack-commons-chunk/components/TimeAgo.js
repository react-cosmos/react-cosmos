import React, { Component } from 'react';
import moment from 'moment/moment';

export default class TimeAgo extends Component {
  render() {
    const timeAgo = moment(1499809595535).fromNow();
    return <p>This example was created {timeAgo}.</p>;
  }
}
