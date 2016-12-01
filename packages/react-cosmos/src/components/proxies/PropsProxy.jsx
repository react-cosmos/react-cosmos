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
      ...fixture,
      ref: onComponentRef,
    });
  }
}

PropsProxy.propTypes = {
  component: React.PropTypes.func.isRequired,
  fixture: React.PropTypes.object.isRequired,
  onComponentRef: React.PropTypes.func.isRequired,
};
