import React, { Component } from 'react';
import styles from './index.less';

class StarryBg extends Component {
  render() {
    const { children } = this.props;
    return (
      <div className={styles.root}>
        <div className={styles.stars}></div>
        {children &&
          <div className={styles.content}>
            {children}
          </div>}
      </div>
    );
  }
}

export default StarryBg;
