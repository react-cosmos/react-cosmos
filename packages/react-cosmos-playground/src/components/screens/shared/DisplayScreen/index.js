import React from 'react';
import CosmosImg from '../../../../static/cosmos.png';
import styles from './index.less';

const DisplayScreen = ({ children }) => {
  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <img src={CosmosImg} />
        <div>{children}</div>
      </div>
    </div>
  );
};

export default DisplayScreen;
