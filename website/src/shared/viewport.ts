export type Viewport = {
  width: number;
  height: number;
};

export function getViewportLength(viewport: Viewport) {
  return Math.max(viewport.width, viewport.height);
}

export function getViewportWidth(viewport: Viewport) {
  return Math.min(viewport.width, viewport.height);
}

export function getCosmonautSize(viewport: Viewport) {
  return getViewportLength(viewport) / 3;
}

export function getBaseFontSize(viewport: Viewport) {
  const length = getViewportLength(viewport);
  const width = getViewportWidth(viewport);
  const anchor = Math.min(width, length / 1.4);
  return Math.round(anchor / 32);
}
