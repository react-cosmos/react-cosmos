// @flow

import React from 'react';
import styles from './header.less';
import classNames from 'classnames';
import find from 'lodash/find';

type CustomButtonProps = {
  width: number,
  height: number,
  onChange: ({ responsive: { width: number, height: number } }) => void,
  isActive: boolean,
  scalable: boolean,
  scale: boolean
};

const CustomButton = ({
  width,
  height,
  onChange,
  isActive,
  scalable,
  scale
}: CustomButtonProps) => {
  const className = classNames(styles.button, {
    [styles.buttonActive]: isActive
  });
  return (
    <button
      className={className}
      onClick={() =>
        isActive ? null : onChange({ responsive: { width: 400, height: 400 } })
      }
    >
      <div>Custom</div>
      {isActive && (
        <span>
          <input
            type="number"
            value={width}
            style={{ width: 40, height: 20 }}
            onChange={e =>
              onChange({
                responsive: { width: parseInt(e.target.value, 10) || 0, height }
              })
            }
          />{' '}
          x{' '}
          <input
            type="number"
            value={height}
            style={{ width: 40, height: 20 }}
            onChange={e =>
              onChange({
                responsive: { height: parseInt(e.target.value, 10) || 0, width }
              })
            }
          />
        </span>
      )}
      {scale && scalable && <div>(Scaled)</div>}
    </button>
  );
};

type SizeButtonProps = {
  label: string,
  width: number,
  height: number,
  onChange: ({ responsive: { width: number, height: number } }) => void,
  isActive: boolean,
  scalable: boolean,
  scale: boolean
};

const SizeButton = ({
  label,
  width,
  height,
  onChange,
  isActive,
  scalable,
  scale
}: SizeButtonProps) => {
  const className = classNames(styles.button, {
    [styles.buttonActive]: isActive
  });
  return (
    <button
      className={className}
      onClick={() => onChange({ responsive: { width, height } })}
    >
      <div>{label}</div>
      {width} x {height}
      {scale && scalable && <div>(Scaled)</div>}
    </button>
  );
};

type Props = {
  onFixtureUpdate: any,
  dimensions: { width: number, height: number, scale: boolean },
  devices: Array<{| label: string, width: number, height: number |}>,
  containerWidth: number,
  containerHeight: number
};

const Header = ({
  onFixtureUpdate,
  dimensions,
  devices,
  containerWidth,
  containerHeight
}: Props) => {
  const { width, height, scale } = dimensions;
  const isCustom = !find(
    devices,
    size => size.width === width && size.height === height
  );
  return (
    <div className={styles.buttonContainer}>
      <CustomButton
        onChange={onFixtureUpdate}
        width={width}
        height={height}
        isActive={isCustom}
        scalable={
          isCustom && (containerWidth < width || containerHeight < height)
        }
        scale={scale}
      />
      {devices.map(size => (
        <SizeButton
          key={size.label}
          onChange={onFixtureUpdate}
          width={size.width}
          height={size.height}
          isActive={width === size.width && height === size.height}
          label={size.label}
          scalable={
            containerWidth < size.width || containerHeight < size.height
          }
          scale={scale}
        />
      ))}
    </div>
  );
};

export default Header;
