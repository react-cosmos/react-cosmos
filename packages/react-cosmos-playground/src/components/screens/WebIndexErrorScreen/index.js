// @flow

import React, { Component } from 'react';
import DisplayScreen from '../shared/DisplayScreen';
import style from '../shared/DisplayScreen/index.less';
import { helpFooter } from '../shared/help-footer';

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
            <strong>
              Please check your terminal and browser console for errors.
            </strong>
          </p>
          {helpFooter}
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
                rel="noopener noreferrer"
              >
                html-webpack-plugin
              </a>{' '}
              to your webpack config
            </strong>{' '}
            and restart Cosmos.
          </p>
          {helpFooter}
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
        {helpFooter}
      </DisplayScreen>
    );
  }
}
