// @flow

import React from 'react';
import styles from './header.less';
import classNames from 'classnames';

type SizeButtonProps = {
  label: string,
  width: number,
  height: number,
  onClick: ({ width: number, height: number }) => void,
  isActive: boolean,
  scaled: boolean
};

const SizeButton = ({
  label,
  width,
  height,
  onClick,
  isActive,
  scaled
}: SizeButtonProps) => {
  const className = classNames(styles.button, {
    [styles.buttonActive]: isActive
  });
  return (
    <button className={className} onClick={() => onClick({ width, height })}>
      <div>{label}</div>
      {width} x {height} {scaled && '(scaled)'}
    </button>
  );
};

const SIZES = [
  { label: 'iPhone 5', width: 320, height: 568 },
  { label: 'iPhone 6', width: 375, height: 667 },
  { label: 'iPhone 6 Plus', width: 414, height: 736 },
  { label: 'Medium', width: 1024, height: 768 },
  { label: 'Large', width: 1440, height: 900 },
  { label: '1080p', width: 1920, height: 1080 }
];

type Props = {
  onFixtureUpdate: any,
  fixture: Object,
  containerWidth: number,
  containerHeight: number
};

const Header = ({
  onFixtureUpdate,
  fixture,
  containerWidth,
  containerHeight
}: Props) => {
  const { width = 320, height = 568 } = fixture;
  return (
    <div className={styles.buttonContainer}>
      {SIZES.map(size => (
        <SizeButton
          key={size.label}
          onClick={onFixtureUpdate}
          width={size.width}
          height={size.height}
          isActive={width === size.width && height === size.height}
          label={size.label}
          scaled={containerWidth < size.width || containerHeight < size.height}
        />
      ))}
    </div>
  );
};

export default Header;
