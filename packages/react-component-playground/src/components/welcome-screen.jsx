import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ScreenTemplate from './screen-template';

const style = require('./display-screen.less');

class WelcomeScreen extends Component {
  render() {
    if (this.props.hasComponents && this.props.hasFixtures) {
      return (
        <ScreenTemplate>
          <p className={style.header}>You're all set! But did you know...</p>
          <ul>
            <li>You can mock Redux state and build custom middleware using <a target="_blank" href="https://github.com/react-cosmos/react-cosmos#proxies">proxies</a>?</li>
            <li>You can search for components and fixtures?<br />Try it, it's all warm and <a target="_blank" href="https://github.com/jeancroy/fuzz-aldrin-plus">fuzzy</a>.</li>
            <li>You can load CSS, polyfills and other files <a target="_blank" href="https://github.com/react-cosmos/react-cosmos#configuration">globally</a>?</li>
          </ul>
          <p>Be a part of React Cosmos by becoming a <a target="_blank" href="https://github.com/react-cosmos/react-cosmos/blob/master/CONTRIBUTING.md">contributor</a>.</p>
        </ScreenTemplate>
      );
    } else if (this.props.hasComponents && !this.props.hasFixtures) {
      return (
        <ScreenTemplate>
          <p className={style.header}>Almost there...</p>
          <p>Your components are listed the left side. It looks like you haven't created fixtures for them yet.</p>
          <p>An empty fixture is available for each component, but chances are your components depend on one or more props to function. </p>
          <p>A fixture is a JSON-like object, except it contains functions and any other types components receive via props.</p>
          <p>Read the <a target="_blank" href="https://github.com/react-cosmos/react-cosmos/blob/master/docs/fixtures.md">creating fixtures</a> guide to help you get started.</p>
        </ScreenTemplate>
      );
    }

    return (
      <ScreenTemplate>
        <p className={style.header}>Congratulations! You're on your way to designing beautiful components.</p>
        <p>No components detected. If you're just starting a new project, this is fine and I envy you, otherwise your setup needs tweaking. Try the following:</p>
        <ul>
          <li>Adjust <code>componentPaths</code> in cosmos.config.js to match your file structure</li>
          <li>Open up a <a target="_blank" href="https://github.com/react-cosmos/react-cosmos/issues">GitHub issue</a> and ask for help by sharing your config and file structure</li>
        </ul>
      </ScreenTemplate>
    );
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
