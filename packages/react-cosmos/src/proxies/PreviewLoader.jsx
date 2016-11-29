import React from 'react';

export default class PreviewLoader extends React.Component {
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

PreviewLoader.propTypes = {
  component: React.PropTypes.func.isRequired,
  fixture: React.PropTypes.object.isRequired,
  onPreviewRef: React.PropTypes.func.isRequired,
};
