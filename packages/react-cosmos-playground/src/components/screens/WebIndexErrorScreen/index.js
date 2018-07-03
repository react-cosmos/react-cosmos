// @flow

import React, { Component } from 'react';
import DisplayScreen from '../DisplayScreen';
import style from '../DisplayScreen/index.less';

import type { PlaygroundWebOpts } from 'react-cosmos-flow/playground';

type Props = {
  options: PlaygroundWebOpts
};

export default class WebIndexErrorScreen extends Component<Props> {
  render() {
    const {
      options: { webpackConfigType, deps }
    } = this.props;

    if (deps['html-webpack-plugin']) {
      return (
        <DisplayScreen>
          <p className={style.header}>Almost there...</p>
          <p>Something is breaking the webpack build :/</p>
          <p>
            <strong>Please check the terminal output to investigate.</strong>
          </p>
          {this.renderFooter()}
        </DisplayScreen>
      );
    }

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
          {this.renderFooter()}
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
        {this.renderFooter()}
      </DisplayScreen>
    );
  }

  renderFooter() {
    return (
      <p className={style.faded}>
        If you can't figure it out{' '}
        <a
          target="_blank"
          href="https://github.com/react-cosmos/react-cosmos/issues/new"
        >
          report your error
        </a>{' '}
        and we'll do our best to help. Include as much details as you can.
      </p>
    );
  }
}
