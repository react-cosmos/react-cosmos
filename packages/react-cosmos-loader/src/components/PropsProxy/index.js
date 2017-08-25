import React, { Component } from 'react';
import { func, object } from 'prop-types';

export default class PropsProxy extends Component {
  /**
   * The final proxy in the chain that renders the selected component.
   */
  render() {
    const { component, fixture, onComponentRef } = this.props;

    return React.createElement(
      component,
      {
        ...fixture.props,
        ref: onComponentRef
      },
      fixture.children
    );
  }
}

PropsProxy.propTypes = {
  component: func.isRequired,
  fixture: object.isRequired,
  onComponentRef: func.isRequired
};
