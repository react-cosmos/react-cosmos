// @flow

import React from 'react';
import classNames from 'classnames';
import { ResponsiveScaleIcon } from '../../../../../components/SvgIcon';
import styles from './index.less';

type Props = {
  scale: boolean,
  setScale: (scale: boolean) => any
};

export const ScaleButton = ({ scale, setScale }: Props) => {
  const className = classNames(styles.button, styles.scaleButton, {
    [styles.buttonActive]: scale
  });

  return (
    <button className={className} onClick={() => setScale(!scale)}>
      <ResponsiveScaleIcon />
    </button>
  );
};
