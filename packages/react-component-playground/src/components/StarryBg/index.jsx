import React, { Component } from 'react';
import styles from './index.less';

class StarryBg extends Component {
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.stars}></div>
      </div>
    );
  }
}

export default StarryBg;
