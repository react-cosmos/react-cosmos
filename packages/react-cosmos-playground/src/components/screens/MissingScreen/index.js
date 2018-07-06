import React, { Component } from 'react';
import { string } from 'prop-types';
import DisplayScreen from '../shared/DisplayScreen';
import style from '../shared/DisplayScreen/index.less';

export default class MissingScreen extends Component {
  static propTypes = {
    componentName: string,
    fixtureName: string
  };

  static defaultProps = {
    componentName: '',
    fixtureName: ''
  };

  render() {
    const { componentName, fixtureName } = this.props;

    return (
      <DisplayScreen>
        <p className={style.header}>Invalid coordinates.</p>
        <p>
          No astronomical object found at{' '}
          <strong>
            {componentName}:{fixtureName}
          </strong>
          .
        </p>
      </DisplayScreen>
    );
  }
}
