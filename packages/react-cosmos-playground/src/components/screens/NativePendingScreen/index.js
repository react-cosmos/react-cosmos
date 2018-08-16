import React, { Component } from 'react';
import DisplayScreen from '../shared/DisplayScreen';
import style from '../shared/DisplayScreen/index.less';
import { helpFooter } from '../shared/help-footer';

export class NativePendingScreen extends Component {
  render() {
    return (
      <DisplayScreen>
        <p className={style.header}>Standing by...</p>
        <p>
          <strong>Waiting for a signal from your React Native build.</strong>
        </p>
        <p>
          Make sure <code>App.js</code> points to Cosmos and your app is
          running. See the{' '}
          <a
            target="_blank"
            href="https://github.com/react-cosmos/create-react-native-app-example"
            rel="noopener noreferrer"
          >
            CRNA example
          </a>{' '}
          for inspiration.
        </p>
        {helpFooter}
      </DisplayScreen>
    );
  }
}
