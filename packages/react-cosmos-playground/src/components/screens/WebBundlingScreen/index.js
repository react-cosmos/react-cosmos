// @flow

import React, { Component } from 'react';
import DisplayScreen from '../shared/DisplayScreen';
import style from '../shared/DisplayScreen/index.less';

export default class WebBundlingScreen extends Component<{}> {
  render() {
    return (
      <DisplayScreen>
        <p className={style.header}>Loading...</p>
        <p>
          <em>Everyday I'm bundling, ev-everyday I'm bundling 🎵</em>
        </p>
      </DisplayScreen>
    );
  }
}
