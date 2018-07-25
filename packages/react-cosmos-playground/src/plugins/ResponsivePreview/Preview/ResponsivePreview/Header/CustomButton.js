// @flow

import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

import type { Viewport } from '../../../types';

type Props = {
  width: number,
  height: number,
  isActive: boolean,
  scalable: boolean,
  scale: boolean,
  changeViewport: (viewport: Viewport) => void
};

export const CustomButton = ({
  width,
  height,
  isActive,
  scalable,
  scale,
  changeViewport
}: Props) => {
  const className = classNames(styles.button, {
    [styles.buttonActive]: isActive
  });

  return (
    <button
      className={className}
      onClick={() =>
        isActive ? null : changeViewport({ width: 400, height: 400 })
      }
    >
      <div className={classNames(styles.label, styles.nowrap)}>Custom</div>
      {isActive && (
        <span>
          <input
            type="number"
            value={width || ''}
            style={{ width: 40, height: 20 }}
            onChange={e =>
              changeViewport({
                width: parseInt(e.target.value, 10) || 0,
                height
              })
            }
          />{' '}
          x{' '}
          <input
            type="number"
            value={height || ''}
            style={{ width: 40, height: 20 }}
            onChange={e =>
              changeViewport({
                width,
                height: parseInt(e.target.value, 10) || 0
              })
            }
          />
        </span>
      )}
      {scale && scalable && <div>(Scaled)</div>}
    </button>
  );
};
