import React from 'react';

export default class PropsProxy extends React.Component {
  /**
   * The final proxy in the chain that renders the featured component.
   */
  render() {
    const {
      component,
      fixture,
      onPreviewRef,
    } = this.props;

    return React.createElement(component, {
      ...fixture,
      ref: onPreviewRef,
    });
  }
}

PropsProxy.propTypes = {
  component: React.PropTypes.func.isRequired,
  fixture: React.PropTypes.object.isRequired,
  onPreviewRef: React.PropTypes.func.isRequired,
};
