// @flow

import React, { Component } from 'react';
import DisplayScreen from '../DisplayScreen';
import style from '../DisplayScreen/index.less';

// TODO: Rename to WebBundlingScreen
export default class LoadingScreen extends Component<{}> {
  render() {
    return (
      <DisplayScreen delayed>
        <p className={style.header}>Loading...</p>
        <p>
          <em>Everyday I'm bundling, ev-everyday I'm bundling 🎵</em>
        </p>
      </DisplayScreen>
    );
  }
}
