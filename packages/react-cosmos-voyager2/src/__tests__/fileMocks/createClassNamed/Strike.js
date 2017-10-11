// @flow

import React from 'react';
import createReactClass from 'create-react-class';

export default createReactClass({
  // Jest seems to automatically add a displayName equal to the filename, so
  // we're using a different name to avoid that behavior
  displayName: 'Del',
  render() {
    return <del>{this.props.name}</del>;
  }
});
