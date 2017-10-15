// @flow

import React, { Component } from 'react';

export default class Bold extends Component<{ name: string }> {
  render() {
    return <strong>{this.props.name}</strong>;
  }
}
