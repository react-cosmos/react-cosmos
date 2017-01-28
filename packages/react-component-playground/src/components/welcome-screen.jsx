import React, { Component, PropTypes } from 'react';

const style = require('./welcome.less');

class WelcomeScreen extends Component {
  render() {
    return (
      <div className={style['welcome-screen']}>
        {this._renderContent()}
      </div>
    );
  }

  _renderContent() {
    if (this.props.hasComponents && this.props.hasFixtures) {
      return (
        <div>
          <span>You're the best.</span>
        </div>
      );
    } else if (this.props.hasComponents && !this.props.hasFixtures) {
      return (
        <div>
          <span>Your components are listed the left side. It looks like you haven't created fixtures for them yet. An empty fixture is available for each component, but chances are your components depend on one or more props to function. </span>
          <span>A fixture is a JSON-like object, except it contains functions and any other types components receive via props.</span>
        </div>
      );
    } else {
      return (
        <div>
          <span>Congratulations! You're on your way to designing beautiful components.</span>
          <span>It looks like you have no components. If you're just starting a new project, this is fine and I envy you. If this isn't a new project and your components aren't showing up, then your setup needs some tweaking. Try the following:</span>
          <ul>
            <li>Adjust componentPaths in cosmos.config.js to match your file structure</li>
            <li>Open up a GitHub issue and ask for help by sharing your config and file structure</li>
          </ul>
        </div>
      );
    }
  }
}

WelcomeScreen.propTypes = {
  hasComponents: PropTypes.bool,
  hasFixtures: PropTypes.bool,
};

WelcomeScreen.defaultProps = {
  hasComponents: false,
  hasFixtures: false,
};

module.exports = WelcomeScreen;
