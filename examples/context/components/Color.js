import PropTypes from 'prop-types';
import React from 'react';

export default class Color extends React.Component {
  render() {
    const { backgroundColor, textColor } = this.context;

    return (
      <div style={{ backgroundColor }}>
        <div style={{ color: textColor }}>Hi there, o beautiful creature!</div>
      </div>
    );
  }
}

Color.contextTypes = {
  backgroundColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired
};
