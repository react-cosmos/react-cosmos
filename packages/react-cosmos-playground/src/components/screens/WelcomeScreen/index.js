import React, { Component } from 'react';
import { objectOf, arrayOf, string } from 'prop-types';
import reduce from 'lodash.reduce';
import DisplayScreen from '../shared/DisplayScreen';
import styles from '../shared/DisplayScreen/index.less';

const { keys } = Object;

const hasComponentFixtures = fixtures =>
  reduce(
    fixtures,
    (acc, compFixtures) => acc || compFixtures.length > 0,
    false
  );

class WelcomeScreen extends Component {
  render() {
    const { fixtures } = this.props;
    const hasComponents = keys(fixtures).length;
    const hasFixtures = hasComponentFixtures(fixtures);

    if (hasComponents && hasFixtures) {
      return (
        <DisplayScreen>
          <p className={styles.header}>You're all set! But did you know...</p>
          <ul>
            <li>
              You can mock Redux state and build custom middleware using{' '}
              <a
                target="_blank"
                href="https://github.com/react-cosmos/react-cosmos#proxies"
              >
                proxies
              </a>
              ?
            </li>
            <li>
              You can search for components and fixtures?
              <br />
              Try it, it's all warm and{' '}
              <a
                target="_blank"
                href="https://github.com/jeancroy/fuzz-aldrin-plus"
              >
                fuzzy
              </a>
              .
            </li>
            <li>
              You can load CSS, polyfills and other files{' '}
              <a
                target="_blank"
                href="https://github.com/react-cosmos/react-cosmos#configuration"
              >
                globally
              </a>
              ?
            </li>
          </ul>
          <p>
            Be a part of React Cosmos by becoming a{' '}
            <a
              target="_blank"
              href="https://github.com/react-cosmos/react-cosmos/blob/master/CONTRIBUTING.md"
            >
              contributor
            </a>
            .
          </p>
        </DisplayScreen>
      );
    }

    return (
      <DisplayScreen>
        <p className={styles.header}>
          Congratulations! You're on your way to designing beautiful components
        </p>
        <p>
          <strong>No fixtures detected.</strong> If you're just starting a new
          project this is fine and I envy you, otherwise your setup needs
          tweaking. Try the following:
        </p>
        <ul>
          <li>
            Create your first{' '}
            <a
              target="_blank"
              href="https://github.com/react-cosmos/react-cosmos#fixtures"
            >
              fixture
            </a>{' '}
            🐣
          </li>
          <li>
            Open up a{' '}
            <a
              target="_blank"
              href="https://github.com/react-cosmos/react-cosmos/issues/new"
            >
              GitHub issue
            </a>{' '}
            and ask for help by sharing your config and file structure
          </li>
        </ul>
      </DisplayScreen>
    );
  }
}

WelcomeScreen.propTypes = {
  fixtures: objectOf(arrayOf(string)).isRequired
};

export default WelcomeScreen;
