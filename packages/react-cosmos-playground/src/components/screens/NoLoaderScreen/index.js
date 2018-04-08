// @flow

import React, { Component } from 'react';
import DisplayScreen from '../DisplayScreen';
import style from '../DisplayScreen/index.less';

import type { PlaygroundOpts } from 'react-cosmos-flow/playground';

type Props = {
  options: PlaygroundOpts
};

export default class NoLoaderScreen extends Component<Props> {
  render() {
    const { options: { webpackConfigType } } = this.props;

    if (webpackConfigType === 'custom') {
      return (
        <DisplayScreen>
          <p className={style.header}>Almost there...</p>
          <p>
            It looks like you're using a custom webpack config that isn't
            outputting an <code>index.html</code>
          </p>
          <p>
            <strong>
              Add{' '}
              <a
                target="_blank"
                href="https://github.com/jantimon/html-webpack-plugin"
              >
                html-webpack-plugin
              </a>{' '}
              to your webpack config
            </strong>{' '}
            and restart Cosmos.
          </p>
          <p>
            If that doesn't work please{' '}
            <a
              target="_blank"
              href="https://github.com/react-cosmos/react-cosmos/blob/master/CONTRIBUTING.md"
            >
              create an issue
            </a>{' '}
            describing your setup.
          </p>
        </DisplayScreen>
      );
    }

    return (
      <DisplayScreen>
        <p className={style.header}>Almost there...</p>
        <p>
          <strong>
            Install <code>html-webpack-plugin</code> in your dev dependencies
          </strong>{' '}
          and restart Cosmos.
        </p>
        <p>The default webpack config will include it automatically.</p>
        <p>
          If that doesn't work please{' '}
          <a
            target="_blank"
            href="https://github.com/react-cosmos/react-cosmos/blob/master/CONTRIBUTING.md"
          >
            create an issue
          </a>{' '}
          describing your setup.
        </p>
      </DisplayScreen>
    );
  }
}
