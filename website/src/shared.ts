export type Viewport = {
  width: number;
  height: number;
};

export const MINIMIZED_HEADER_SIZE_PX = 96;
export const MINIMIZED_HEADER_PADDING_PX = 8;

export function getViewportLength(viewport: Viewport) {
  return Math.max(viewport.width, viewport.height);
}

export function getCosmonautSize(windowViewport: Viewport) {
  return getViewportLength(windowViewport) / 3;
}

export function getMinimizedCosmonautSize(
  windowViewport: Viewport,
  minimizeRatio: number
) {
  const fullSize = getCosmonautSize(windowViewport);
  return Math.round(
    fullSize - (fullSize - MINIMIZED_HEADER_SIZE_PX) * minimizeRatio
  );
}
