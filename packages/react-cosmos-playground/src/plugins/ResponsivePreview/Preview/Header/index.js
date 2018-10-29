// @flow

import React from 'react';
import find from 'lodash/find';
import { SizeButton } from './SizeButton';
import { CustomButton } from './CustomButton';
import { ScaleButton } from './ScaleButton';
import styles from './index.less';

import type { Devices, Viewport } from '../../types';

type Props = {
  devices: Devices,
  viewport: Viewport,
  container: Viewport,
  scale: boolean,
  changeViewport: (viewport: Viewport) => void,
  setScale: (scale: boolean) => any
};

export const Header = ({
  devices,
  viewport: { width, height },
  container,
  scale,
  changeViewport,
  setScale
}: Props) => {
  const isCustom = !find(
    devices,
    size => size.width === width && size.height === height
  );

  return (
    <div className={styles.buttonContainer}>
      <CustomButton
        width={width}
        height={height}
        isActive={isCustom}
        scalable={
          isCustom && (container.width < width || container.height < height)
        }
        scale={scale}
        changeViewport={changeViewport}
      />
      {devices.map(size => {
        const scaleWidth = Math.min(1, container.width / size.width);
        const scaleHeight = Math.min(1, container.height / size.height);
        const scaleFactor = scale ? Math.min(scaleWidth, scaleHeight) : 1;

        return (
          <SizeButton
            key={size.label}
            width={size.width}
            height={size.height}
            isActive={width === size.width && height === size.height}
            label={size.label}
            scalable={
              container.width < size.width || container.height < size.height
            }
            scaleFactor={scaleFactor}
            scale={scale}
            changeViewport={changeViewport}
          />
        );
      })}
      <ScaleButton scale={scale} setScale={setScale} />
    </div>
  );
};
