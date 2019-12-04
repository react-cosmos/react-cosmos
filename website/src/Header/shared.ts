export type Viewport = {
  width: number;
  height: number;
};

export const COSMONAUT_SIZE_PX = 64;
export const COSMONAUT_HPADDING_PX = 8;
export const COSMONAUT_VPADDING_PX = 8;

export const MAX_HEADER_WIDTH_PX = 640;
export const HEADER_HEIGHT_PX = COSMONAUT_SIZE_PX + 2 * COSMONAUT_VPADDING_PX;

export const MAX_CONTENT_WIDTH_PX = 960;
export const MIN_CENTER_HEADER_WIDTH_PX = 384;

export function getViewportLength(viewport: Viewport) {
  return Math.max(viewport.width, viewport.height);
}

export function getCosmonautSize(windowViewport: Viewport) {
  return getViewportLength(windowViewport) / 3;
}
