import { white20 } from '../../../shared/colors';
import { Viewport } from '../public';

export const responsivePreviewPadding = {
  top: 8,
  bottom: 24,
  left: 24,
  right: 24,
};
export const responsivePreviewBorderWidth = 1;

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
  return {
    paddingTop: responsivePreviewPadding.top,
    paddingBottom: responsivePreviewPadding.bottom,
    paddingLeft: responsivePreviewPadding.left,
    paddingRight: responsivePreviewPadding.right,
  };
}

function getAlignContainerStyle(scaledWidth: number, scaledHeight: number) {
  return {
    width: scaledWidth,
    height: scaledHeight,
    border: `${responsivePreviewBorderWidth}px solid ${white20}`,
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
  return (
    responsivePreviewPadding.left +
    responsivePreviewPadding.right +
    2 * responsivePreviewBorderWidth
  );
}

function getVerPadding() {
  return (
    responsivePreviewPadding.top +
    responsivePreviewPadding.bottom +
    2 * responsivePreviewBorderWidth
  );
}
