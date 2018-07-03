import React, { Component } from 'react';
import DisplayScreen from '../shared/DisplayScreen';
import style from '../shared/DisplayScreen/index.less';
import { helpFooter } from '../shared/help-footer';

export class NativeSelectedScreen extends Component {
  render() {
    return (
      <DisplayScreen>
        <p className={style.header}>Fixture loaded remotely</p>
        <p>
          <strong>
            Check your device or simulator to see the loaded fixture.
          </strong>
        </p>
        {helpFooter}
      </DisplayScreen>
    );
  }
}
