import React from 'react';
import classNames from 'classnames';
import CosmosImg from '../../../static/cosmos.png';
import styles from './index.less';

const DisplayScreen = ({ children, delayed = false }) => {
  const innerClasses = classNames(styles.inner, {
    [styles.innerDelayed]: delayed
  });

  return (
    <div className={styles.root}>
      <div className={innerClasses}>
        <img src={CosmosImg} />
        <div>{children}</div>
      </div>
    </div>
  );
};

export default DisplayScreen;
