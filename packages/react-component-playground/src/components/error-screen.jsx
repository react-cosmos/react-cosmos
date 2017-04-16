import React, { Component, PropTypes } from 'react';
import StarryBackground from './starry-background';

const style = require('./display-screen.less');

class ErrorScreen extends Component {
  render() {
    return (
      <div className={style['display-screen']}>
        <StarryBackground />
        {this._renderContent()}
      </div>
    );
  }

  _renderContent() {
    const className = style['display-screen-inner'];
    const { componentName, fixtureName } = this.props;

    return (
      <div className={className}>
        <p>Invalid coordinates.</p>
        <p>No astronomical object found at {componentName}:{fixtureName}.</p>
      </div>
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
