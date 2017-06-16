import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ScreenTemplate from './screen-template';

const style = require('./display-screen.less');

class ErrorScreen extends Component {
  render() {
    const { componentName, fixtureName } = this.props;

    return (
      <ScreenTemplate>
        <p className={style.header}>Invalid coordinates.</p>
        <p>No astronomical object found at <strong>{componentName}:{fixtureName}</strong>.</p>
      </ScreenTemplate>
    );
  }
}

ErrorScreen.propTypes = {
  componentName: PropTypes.string,
  fixtureName: PropTypes.string,
};

ErrorScreen.defaultProps = {
  componentName: '',
  fixtureName: '',
};

export default ErrorScreen;
