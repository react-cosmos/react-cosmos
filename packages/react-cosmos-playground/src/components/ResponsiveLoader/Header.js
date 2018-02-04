// @flow

import React from 'react';
import styles from './header.less';
import classNames from 'classnames';
import find from 'lodash/find';
import localForage from 'localforage';

import { RESPONSIVE_FIXTURE_WIDTH, RESPONSIVE_FIXTURE_HEIGHT } from './';

type CustomButtonProps = {
  width: number,
  height: number,
  isActive: boolean,
  scalable: boolean,
  scale: boolean,
  updateDimensions: (width: number, height: number) => void
};

const CustomButton = ({
  width,
  height,
  isActive,
  scalable,
  scale,
  routeLink,
  updateDimensions
}: CustomButtonProps) => {
  const className = classNames(styles.button, {
    [styles.buttonActive]: isActive
  });
  return (
    <button
      className={className}
      onClick={() => (isActive ? null : updateDimensions(400, 400))}
    >
      <div>Custom</div>
      {isActive && (
        <span>
          <input
            type="number"
            value={width}
            style={{ width: 40, height: 20 }}
            onChange={e =>
              updateDimensions(parseInt(e.target.value, 10) || 0, height)
            }
          />{' '}
          x{' '}
          <input
            type="number"
            value={height}
            style={{ width: 40, height: 20 }}
            onChange={e =>
              updateDimensions(width, parseInt(e.target.value, 10) || 0)
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
  isActive: boolean,
  scalable: boolean,
  scale: boolean,
  updateDimensions: (width: number, height: number) => void
};

const SizeButton = ({
  label,
  width,
  height,
  isActive,
  scalable,
  scale,
  updateDimensions
}: SizeButtonProps) => {
  const className = classNames(styles.button, {
    [styles.buttonActive]: isActive
  });
  return (
    <button
      className={className}
      onClick={() => updateDimensions(width, height)}
    >
      <div>{label}</div>
      {width} x {height}
      {scale && scalable && <div>(Scaled)</div>}
    </button>
  );
};

type Props = {
  dimensions: { width: number, height: number, scale: boolean },
  devices: Array<{| label: string, width: number, height: number |}>,
  containerWidth: number,
  containerHeight: number,
  updateDimensions: (width: number, height: number) => void
};

class Header extends React.Component<Props> {
  render() {
    const {
      updateDimensions,
      dimensions,
      devices,
      containerWidth,
      containerHeight
    } = this.props;

    const { width, height, scale } = dimensions;
    const isCustom = !find(
      devices,
      size => size.width === width && size.height === height
    );
    return (
      <div className={styles.buttonContainer}>
        <CustomButton
          updateDimensions={updateDimensions}
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
            updateDimensions={updateDimensions}
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
  }
}

export default Header;
