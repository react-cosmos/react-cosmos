import PropTypes from 'prop-types';
import React from 'react';

export default class PropsProxy extends React.Component {
  /**
   * The final proxy in the chain that renders the selected component.
   */
  render() {
    const {
      component,
      fixture,
      onComponentRef,
    } = this.props;

    return React.createElement(component, {
      ...fixture.props,
      ref: onComponentRef,
    }, fixture.children);
  }
}

PropsProxy.propTypes = {
  component: PropTypes.func.isRequired,
  fixture: PropTypes.object.isRequired,
  onComponentRef: PropTypes.func.isRequired,
};
