// @flow

import type { Viewport } from '../shared';

const PADDING = 16;
const BORDER_WIDTH = 2;

export const stretchStyle = { width: '100%', height: '100%' };

export function getStyles({
  container,
  viewport,
  scale
}: {
  container: Viewport,
  viewport: Viewport,
  scale: boolean
}) {
  const { width, height } = viewport;

  const innerContainer = {
    width: container.width - 2 * (PADDING + BORDER_WIDTH),
    height: container.height - 2 * (PADDING + BORDER_WIDTH)
  };

  const widthScale = Math.min(1, innerContainer.width / width);
  const heightScale = Math.min(1, innerContainer.height / height);
  const scaleFactor = scale ? Math.min(widthScale, heightScale) : 1;
  const scaledWidth = width * scaleFactor;
  const scaledHeight = height * scaleFactor;

  return {
    outerWrapperStyle: getOuterWrapperStyle({
      scale,
      widthScale,
      heightScale
    }),
    middleWrapperStyle: getMiddleWrapperStyle({
      scaledWidth,
      scaledHeight
    }),
    innerWrapperStyle: getInnerWrapperStyle({
      width,
      height,
      scaleFactor
    })
  };
}

function getOuterWrapperStyle({ scale, widthScale, heightScale }) {
  return {
    display: 'flex',
    padding: PADDING,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    justifyContent: scale || widthScale === 1 ? 'space-around' : 'flex-start',
    alignItems: scale || heightScale === 1 ? 'center' : 'flex-start',
    overflow: scale ? 'hidden' : 'scroll'
  };
}

function getMiddleWrapperStyle({ scaledWidth, scaledHeight }) {
  return {
    width: scaledWidth + 2 * BORDER_WIDTH,
    height: scaledHeight + 2 * BORDER_WIDTH
  };
}

function getInnerWrapperStyle({ width, height, scaleFactor }) {
  return {
    boxSizing: 'border-box',
    width: width + 2 * BORDER_WIDTH,
    height: height + 2 * BORDER_WIDTH,
    borderStyle: 'dashed',
    borderWidth: BORDER_WIDTH,
    borderColor: 'rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    transformOrigin: '0% 0%',
    transform: `scale(${scaleFactor})`
  };
}
