// @flow

import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

import type { Viewport } from '../../types';

type Props = {
  label: string,
  width: number,
  height: number,
  isActive: boolean,
  scalable: boolean,
  scale: boolean,
  scaleFactor: number,
  changeViewport: (viewport: Viewport) => void
};

export const SizeButton = ({
  label,
  width,
  height,
  isActive,
  scalable,
  scale,
  scaleFactor = 1,
  changeViewport
}: Props) => {
  const className = classNames(styles.button, {
    [styles.buttonActive]: isActive
  });

  return (
    <button
      className={className}
      onClick={() => changeViewport({ width, height })}
    >
      <div className={classNames(styles.label, styles.nowrap)}>{label}</div>
      <div className={styles.nowrap}>
        {width} x {height}
      </div>
      {scale &&
        scalable && (
          <div className={classNames(styles.scaled, styles.nowrap)}>
            {`(Scaled ${parseInt(scaleFactor * 100, 10)}%)`}
          </div>
        )}
    </button>
  );
};
