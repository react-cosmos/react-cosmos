import { Viewport } from '../public';

const PADDING = [4, 12, 12, 12];
const BORDER_WIDTH = 1;

export const stretchStyle = { display: 'flex', flex: 1 };

export function getStyles({
  container,
  viewport,
  scale
}: {
  container: Viewport;
  viewport: Viewport;
  scale: boolean;
}) {
  const { width, height } = viewport;

  const availableViewport = getAvailableViewport(container);
  const widthScale = Math.min(1, availableViewport.width / width);
  const heightScale = Math.min(1, availableViewport.height / height);
  const scaleFactor = scale ? Math.min(widthScale, heightScale) : 1;
  const scaledWidth = width * scaleFactor;
  const scaledHeight = height * scaleFactor;

  return {
    maskContainerStyle: getMaskContainerStyle(scale, widthScale, heightScale),
    padContainerStyle: getPadContainerStyle(),
    alignContainerStyle: getAlignContainerStyle(scaledWidth, scaledHeight),
    scaleContainerStyle: getScaleContainerStyle(width, height, scaleFactor)
  };
}

export function getAvailableViewport(container: Viewport) {
  return {
    width: container.width - getHorPadding(),
    height: container.height - getVerPadding()
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
    overflow: scale ? 'hidden' : 'scroll'
  };
}

function getPadContainerStyle() {
  const [paddingTop, paddingRight, paddingBottom, paddingLeft] = PADDING;

  return {
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight
  };
}

function getAlignContainerStyle(scaledWidth: number, scaledHeight: number) {
  return {
    width: scaledWidth,
    height: scaledHeight,
    border: `${BORDER_WIDTH}px solid var(--grey5)`,
    boxShadow: '0 2px 10px 0 var(--grey5)',
    overflow: 'hidden'
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
    transform: `scale(${scaleFactor})`
  };
}

function getHorPadding() {
  return PADDING[1] + PADDING[3] + 2 * BORDER_WIDTH;
}

function getVerPadding() {
  return PADDING[0] + PADDING[2] + 2 * BORDER_WIDTH;
}
