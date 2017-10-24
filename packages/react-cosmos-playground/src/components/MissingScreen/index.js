import React, { Component } from 'react';
import { string } from 'prop-types';
import DisplayScreen from '../DisplayScreen';
import style from '../DisplayScreen/index.less';

class MissingScreen extends Component {
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

MissingScreen.propTypes = {
  componentName: string,
  fixtureName: string
};

MissingScreen.defaultProps = {
  componentName: '',
  fixtureName: ''
};

export default MissingScreen;
