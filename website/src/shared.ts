export type Viewport = {
  width: number;
  height: number;
};

export const COSMONAUT_SIZE_PX = 96;
export const HEADER_HPADDING_PX = 8;
export const HEADER_VPADDING_PX = 8;

export const MAX_CONTENT_WIDTH_PX = 980;

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
  return fullSize - (fullSize - COSMONAUT_SIZE_PX) * minimizeRatio;
}
