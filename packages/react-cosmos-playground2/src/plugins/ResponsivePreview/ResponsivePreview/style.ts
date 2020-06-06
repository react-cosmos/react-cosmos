import { white20 } from '../../../shared/colors';
import { Viewport } from '../public';

const PADDING = [8, 12, 12, 12];
const BORDER_WIDTH = 1;

export const stretchStyle = { display: 'flex', flex: 1 };

export function getStyles({
  container,
  viewport,
  scaled,
}: {
  container: Viewport;
  viewport: Viewport;
  scaled: boolean;
}) {
  const { width, height } = viewport;

  const availableViewport = getAvailableViewport(container);
  const widthScale = Math.min(1, availableViewport.width / width);
  const heightScale = Math.min(1, availableViewport.height / height);
  const scaleFactor = scaled ? Math.min(widthScale, heightScale) : 1;
  const scaledWidth = width * scaleFactor;
  const scaledHeight = height * scaleFactor;

  return {
    maskContainerStyle: getMaskContainerStyle(scaled, widthScale, heightScale),
    padContainerStyle: getPadContainerStyle(),
    alignContainerStyle: getAlignContainerStyle(scaledWidth, scaledHeight),
    scaleContainerStyle: getScaleContainerStyle(width, height, scaleFactor),
  };
}

export function getViewportScaleFactor(
  viewport: Viewport,
  container: Viewport
) {
  const containerViewport = getAvailableViewport(container);
  return Math.min(
    Math.min(1, containerViewport.width / viewport.width),
    Math.min(1, containerViewport.height / viewport.height)
  );
}

function getAvailableViewport(container: Viewport) {
  return {
    width: container.width - getHorPadding(),
    height: container.height - getVerPadding(),
  };
}

function getMaskContainerStyle(
  scale: boolean,
  widthScale: number,
  heightScale: number
) {
  return {
    flex: 1,
    display: 'flex',
    justifyContent: scale || widthScale === 1 ? 'space-around' : 'flex-start',
    alignItems: scale || heightScale === 1 ? 'center' : 'flex-start',
    overflow: scale ? 'hidden' : 'scroll',
  };
}

function getPadContainerStyle() {
  const [paddingTop, paddingRight, paddingBottom, paddingLeft] = PADDING;

  return {
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  };
}

function getAlignContainerStyle(scaledWidth: number, scaledHeight: number) {
  return {
    width: scaledWidth,
    height: scaledHeight,
    border: `${BORDER_WIDTH}px solid ${white20}`,
    overflow: 'hidden',
  };
}

function getScaleContainerStyle(
  width: number,
  height: number,
  scaleFactor: number
) {
  return {
    width,
    height,
    transformOrigin: '0% 0%',
    transform: `scale(${scaleFactor})`,
  };
}

function getHorPadding() {
  return PADDING[1] + PADDING[3] + 2 * BORDER_WIDTH;
}

function getVerPadding() {
  return PADDING[0] + PADDING[2] + 2 * BORDER_WIDTH;
}
