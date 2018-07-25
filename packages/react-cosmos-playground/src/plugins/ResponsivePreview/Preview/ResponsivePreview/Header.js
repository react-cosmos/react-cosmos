// @flow

import React from 'react';
import classNames from 'classnames';
import find from 'lodash/find';
import styles from './Header.less';

type CustomButtonProps = {
  width: number,
  height: number,
  isActive: boolean,
  scalable: boolean,
  scale: boolean,
  onViewportChange: (width: number, height: number) => void
};

const CustomButton = ({
  width,
  height,
  isActive,
  scalable,
  scale,
  onViewportChange
}: CustomButtonProps) => {
  const className = classNames(styles.button, {
    [styles.buttonActive]: isActive,
    [styles.buttonNotActive]: !isActive
  });

  return (
    <button
      className={className}
      onClick={() => (isActive ? null : onViewportChange(400, 400))}
    >
      <div>Custom</div>
      {isActive && (
        <span>
          <input
            type="number"
            value={width || ''}
            style={{ width: 40, height: 20 }}
            onChange={e =>
              onViewportChange(parseInt(e.target.value, 10) || 0, height)
            }
          />{' '}
          x{' '}
          <input
            type="number"
            value={height || ''}
            style={{ width: 40, height: 20 }}
            onChange={e =>
              onViewportChange(width, parseInt(e.target.value, 10) || 0)
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
  scaleFactor: number,
  onViewportChange: (width: number, height: number) => void,
  setScale: (scale: boolean) => any
};

const SizeButton = ({
  label,
  width,
  height,
  isActive,
  scalable,
  scale,
  scaleFactor = 1,
  onViewportChange,
  setScale
}: SizeButtonProps) => {
  const className = classNames(styles.button, {
    [styles.buttonActive]: isActive,
    [styles.buttonNotActive]: !isActive
  });
  return (
    <button
      className={className}
      onClick={() => onViewportChange(width, height)}
    >
      <div>{label}</div>
      {width} x {height}
      {scale &&
        scalable && (
          <div
            onClick={() => isActive && setScale(false)}
            className={isActive ? styles.scaleLink : ''}
          >
            (Scaled {parseInt(scaleFactor * 100, 10)}%)
          </div>
        )}
      {!scale &&
        scalable &&
        isActive && (
          <div className={styles.scaleLink} onClick={() => setScale(true)}>
            Scale
          </div>
        )}
    </button>
  );
};

type Props = {
  dimensions: { width: number, height: number, scale: boolean },
  devices: Array<{| label: string, width: number, height: number |}>,
  containerWidth: number,
  containerHeight: number,
  onViewportChange: (width: number, height: number) => void,
  setScale: (scale: boolean) => any
};

const Header = ({
  onViewportChange,
  dimensions,
  devices,
  containerWidth,
  containerHeight,
  setScale
}: Props) => {
  const { width, height, scale } = dimensions;
  const isCustom = !find(
    devices,
    size => size.width === width && size.height === height
  );
  return (
    <div className={styles.buttonContainer}>
      <CustomButton
        onViewportChange={onViewportChange}
        width={width}
        height={height}
        isActive={isCustom}
        scalable={
          isCustom && (containerWidth < width || containerHeight < height)
        }
        scale={scale}
      />
      {devices.map(size => {
        const scaleWidth = Math.min(1, containerWidth / size.width);
        const scaleHeight = Math.min(1, containerHeight / size.height);
        const scaleFactor = scale ? Math.min(scaleWidth, scaleHeight) : 1;

        return (
          <SizeButton
            key={size.label}
            onViewportChange={onViewportChange}
            width={size.width}
            height={size.height}
            isActive={width === size.width && height === size.height}
            label={size.label}
            scalable={
              containerWidth < size.width || containerHeight < size.height
            }
            scaleFactor={scaleFactor}
            scale={scale}
            setScale={setScale}
          />
        );
      })}
    </div>
  );
};

export default Header;
