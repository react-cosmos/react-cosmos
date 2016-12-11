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
  backgroundColor: React.PropTypes.string.isRequired,
  textColor: React.PropTypes.string.isRequired,
};
