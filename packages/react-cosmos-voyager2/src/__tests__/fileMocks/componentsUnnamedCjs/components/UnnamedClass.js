// @flow

import React, { Component } from 'react';

export default class extends Component<{ name: string }> {
  render() {
    return <span>{this.props.name}</span>;
  }
}
