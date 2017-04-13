import React, { Component, PropTypes } from 'react';

const style = require('./welcome-screen.less');

class ErrorScreen extends Component {
  render() {
    return (
      <div className={style['welcome-screen']}>
        {this._renderStarryBackground()}
        {this._renderContent()}
      </div>
    );
  }

  _renderContent() {
    const className = style['welcome-screen-inner'];
    const { componentName, fixtureName } = this.props;

    return (
      <div className={className}>
        <p>Invalid coordinates.</p>
        <p>No astronomical object found at {componentName}:{fixtureName}.</p>
      </div>
    );
  }

  _renderStarryBackground() {
    return <div className={style['starry-background']}>
      <div className={style.stars}></div>
      <div className={style.twinkling}></div>
      <div className={style.clouds}></div>
    </div>;
  }
}

ErrorScreen.propTypes = {
  componentName: PropTypes.string,
  fixtureName: PropTypes.string,
};

ErrorScreen.defaultProps = {
  componentName: "",
  fixtureName: "",
};

export default ErrorScreen;
