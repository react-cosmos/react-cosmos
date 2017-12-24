import React from 'react';
import styles from './mock.less';

const Mock = () => (
  <div style={{ fontSize: 50, backgroundColor: 'deepskyblue' }}>
    <div className={styles.showSmall}>I am small</div>
    <div className={styles.showMedium}>I am medium</div>
    <div className={styles.showLarge}>I am large</div>
  </div>
);

export default Mock;
