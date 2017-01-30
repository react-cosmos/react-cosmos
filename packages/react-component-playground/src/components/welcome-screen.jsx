import React, { Component, PropTypes } from 'react';

const style = require('./welcome-screen.less');

class WelcomeScreen extends Component {
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

    if (this.props.hasComponents && this.props.hasFixtures) {
      return (
        <div className={className}>
          <p>You're all set! But did you know...</p>
          <ul>
            <li>You can mock Redux state and build custom middleware using <a target="_blank" href="https://github.com/react-cosmos/react-cosmos#configuration">proxies</a></li>
            <li>You can search for components and fixtures? Try it, it's all warm and <a target="_blank" href="https://github.com/jeancroy/fuzz-aldrin-plus">fuzzy</a>.</li>
            <li>You can load CSS, polyfills, and any other files <a target="_blank" href="https://github.com/react-cosmos/react-cosmos#configuration">globally</a>?</li>
          </ul>
          <p>Be part of React Cosmos by becoming a <a target="_blank" href="https://github.com/react-cosmos/react-cosmos/blob/master/CONTRIBUTING.md">contributor</a>.</p>
        </div>
      );
    } else if (this.props.hasComponents && !this.props.hasFixtures) {
      return (
        <div className={className}>
          <p>Your components are listed the left side. It looks like you haven't created fixtures for them yet. An empty fixture is available for each component, but chances are your components depend on one or more props to function. </p>
          <p>A fixture is a JSON-like object, except it contains functions and any other types components receive via props.</p>
          <p>Here's a guide on creating fixtures to help you get started: <a target="_blank" href="https://github.com/react-cosmos/react-cosmos/blob/master/docs/fixtures.md">Creating Fixtures</a></p>
        </div>
      );
    }

    return (
      <div className={className}>
        <p>Congratulations! You're on your way to designing beautiful components.</p>
        <p>No components found. If you're just starting a new project, this is fine and I envy you, otherwise your setup needs tweaking. Try the following:</p>
        <ul>
          <li>Adjust <code>componentPaths</code> in cosmos.config.js to match your file structure</li>
          <li>Open up a <a target="_blank" href="https://github.com/react-cosmos/react-cosmos/issues">GitHub issue</a> and ask for help by sharing your config and file structure</li>
        </ul>
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

WelcomeScreen.propTypes = {
  hasComponents: PropTypes.bool,
  hasFixtures: PropTypes.bool,
};

WelcomeScreen.defaultProps = {
  hasComponents: false,
  hasFixtures: false,
};

export default WelcomeScreen;
