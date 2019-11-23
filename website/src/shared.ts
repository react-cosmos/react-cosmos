export type Viewport = {
  width: number;
  height: number;
};

export const MINIMIZED_HEADER_SIZE_PX = 96;
export const MINIMIZED_HEADER_HPADDING_PX = 8;
export const MINIMIZED_HEADER_VPADDING_PX = 8;

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
  return Math.round(
    fullSize - (fullSize - MINIMIZED_HEADER_SIZE_PX) * minimizeRatio
  );
}
